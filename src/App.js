import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDashboard from './components/UserDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseAnonKey) {
  console.log(JSON.stringify({"message":"No API key found in request","hint":"No `apikey` request header or url param was found."}));
}

export default function AttendanceApp() {
  const navigate = useNavigate();

  // Global state
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch attendance from Supabase
  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase.from('attendance').select('*');
      if (error) throw error;
      setAttendance(data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  // Fetch attendance session from Supabase
  const fetchAttendanceSession = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        setAttendanceSession({
          active: data.active,
          location: { lat: data.location_lat, lng: data.location_lng },
          radius: data.radius,
          area: data.area
        });
      }
    } catch (err) {
      console.error('Error fetching attendance session:', err);
      // Keep default values if fetch fails
    }
  };

  const [attendanceSession, setAttendanceSession] = useState({
    active: true,
    location: { lat: 31.5497, lng: 74.3436 },
    radius: 100,
    area: 'RRU Cricket Ground'
  });

  useEffect(() => {
    fetchUsers();
    fetchAttendance();
    fetchAttendanceSession();
  }, []);

  // UI State
  const [showPassword, setShowPassword] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success', 'error', 'info', 'confirm'
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '' });



  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError('');
        },
        (error) => {
          setLocationError('Unable to get location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Async version for combined action
  const getUserLocationAsync = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(loc);
            setLocationError('');
            resolve(loc);
          },
          (error) => {
            setLocationError('Unable to get location. Please enable location services.');
            reject(error);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  // Combined action: get location and mark attendance
  const handleCombinedAction = async () => {
    try {
      const location = await getUserLocationAsync();
      handleMarkAttendance(location);
    } catch (err) {
      // Error handling is done in getUserLocationAsync
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // USER FUNCTIONS
  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginForm.email)
        .eq('password', loginForm.password)
        .eq('role', 'user')
        .single();

      if (error || !data) {
        setPopupMessage('Invalid email or password');
        setPopupType('error');
        setShowPopup(true);
        return;
      }

      setCurrentUser(data);
      navigate('/user-dashboard');
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      setPopupMessage('Login failed: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegister = async () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      setPopupMessage('Passwords do not match');
      setPopupType('error');
      setShowPopup(true);
      return;
    }
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setPopupMessage('Please fill all fields');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', registerForm.email)
        .single();

      if (existingUser) {
        setPopupMessage('Email already registered');
        setPopupType('error');
        setShowPopup(true);
        return;
      }

      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert([
          {
            name: registerForm.name,
            email: registerForm.email,
            username: registerForm.email, // Use email as username
            password: registerForm.password,
            role: 'user'
          }
        ])
        .select();

      if (error) throw error;

      setPopupMessage('Registration successful! Please login.');
      setPopupType('success');
      setShowPopup(true);
      // Note: Navigation to login will happen on popup close
      fetchUsers(); // Refresh users list
    } catch (err) {
      setPopupMessage('Registration failed: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    }
  };



  const handleMarkAttendance = async (location = userLocation) => {
    if (!attendanceSession.active) {
      setPopupMessage('No active attendance session');
      setPopupType('error');
      setShowPopup(true);
      return;
    }
    if (!location) {
      setPopupMessage('Please enable location services');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    const distance = calculateDistance(
      location.lat,
      location.lng,
      attendanceSession.location.lat,
      attendanceSession.location.lng
    );

    const alreadyMarked = attendance.find(
      a => a.user_id === currentUser.id && a.date === new Date().toISOString().split('T')[0]
    );
    if (alreadyMarked) {
      setPopupMessage('Attendance already marked for today');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    const status = distance > attendanceSession.radius ? 'Absent' : 'Present';

    try {
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString(),
            status: status,
            location: attendanceSession.area
          }
        ])
        .select();

      if (error) throw error;

      fetchAttendance(); // Refresh attendance list
      setPopupMessage(`Attendance marked as ${status}!`);
      setPopupType('success');
      setShowPopup(true);
    } catch (err) {
      console.error('Error marking attendance:', err);
      if (err.message.includes('duplicate key')) {
        setPopupMessage('Attendance already marked for today');
      } else {
        setPopupMessage('Failed to mark attendance: ' + err.message);
      }
      setPopupType('error');
      setShowPopup(true);
    }
  };

  // ADMIN FUNCTIONS
  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', adminLogin.username)
        .eq('password', adminLogin.password)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        setPopupMessage('Invalid admin credentials');
        setPopupType('error');
        setShowPopup(true);
        return;
      }

      setIsAdmin(true);
      navigate('/admin-dashboard');
      setAdminLogin({ username: '', password: '' });
    } catch (err) {
      setPopupMessage('Admin login failed: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      setPopupMessage('Please fill all fields');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUserForm.email)
        .single();

      if (existingUser) {
        setPopupMessage('Email already exists');
        setPopupType('error');
        setShowPopup(true);
        return;
      }

      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert([
          {
            name: newUserForm.name,
            email: newUserForm.email,
            username: newUserForm.email, // Use email as username
            password: newUserForm.password,
            role: 'user'
          }
        ])
        .select();

      if (error) throw error;

      setNewUserForm({ name: '', email: '', password: '' });
      setPopupMessage('User added successfully');
      setPopupType('success');
      setShowPopup(true);
      fetchUsers(); // Refresh users list
    } catch (err) {
      setPopupMessage('Failed to add user: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    setPendingDeleteUserId(userId);
    setPopupMessage('Are you sure you want to delete this user?');
    setPopupType('confirm');
    setShowPopup(true);
  };

  const confirmDeleteUser = async () => {
    if (!pendingDeleteUserId) return;

    try {
      // Delete attendance records first
      const { error: attendanceError } = await supabase
        .from('attendance')
        .delete()
        .eq('user_id', pendingDeleteUserId);

      if (attendanceError) throw attendanceError;

      // Then delete the user
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', pendingDeleteUserId);

      if (userError) throw userError;

      fetchUsers(); // Refresh users list
      fetchAttendance(); // Refresh attendance list
      setPopupMessage('User deleted successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (err) {
      setPopupMessage('Failed to delete user: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setPendingDeleteUserId(null);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user.id);
    setEditForm({ name: user.name, email: user.email, password: user.password });
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: editForm.name,
          email: editForm.email,
          password: editForm.password
        })
        .eq('id', editUser);

      if (error) throw error;

      fetchUsers(); // Refresh users list
      setEditUser(null);
      setEditForm({ name: '', email: '', password: '' });
      setPopupMessage('User updated successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (err) {
      setPopupMessage('Failed to update user: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  // Save attendance session to Supabase
  const saveAttendanceSession = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('attendance_sessions')
        .upsert({
          id: 1,
          active: attendanceSession.active,
          location_lat: attendanceSession.location.lat,
          location_lng: attendanceSession.location.lng,
          radius: attendanceSession.radius,
          area: attendanceSession.area
        });

      if (error) throw error;

      // Refresh the attendance session data after saving
      await fetchAttendanceSession();

      setPopupMessage('Attendance session settings saved successfully!');
      setPopupType('success');
      setShowPopup(true);
    } catch (err) {
      setPopupMessage('Failed to save attendance session settings: ' + err.message);
      setPopupType('error');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} showPassword={showPassword} setShowPassword={setShowPassword} handleUserLogin={handleUserLogin} navigate={navigate} loading={loading} />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <RegisterPage registerForm={registerForm} setRegisterForm={setRegisterForm} showPassword={showPassword} setShowPassword={setShowPassword} handleUserRegister={handleUserRegister} navigate={navigate} />
          </motion.div>
        } />
        <Route path="/user-dashboard" element={
          currentUser ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <UserDashboard
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                navigate={navigate}
                attendance={attendance}
                attendanceSession={attendanceSession}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                locationError={locationError}
                setLocationError={setLocationError}
                getUserLocation={getUserLocation}
                calculateDistance={calculateDistance}
                handleMarkAttendance={handleMarkAttendance}
                handleCombinedAction={handleCombinedAction}
              />
            </motion.div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/admin-login" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AdminLoginPage adminLogin={adminLogin} setAdminLogin={setAdminLogin} showPassword={showPassword} setShowPassword={setShowPassword} handleAdminLogin={handleAdminLogin} navigate={navigate} loading={loading} />
          </motion.div>
        } />
        <Route path="/admin-dashboard" element={
          isAdmin ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AdminDashboard
                setIsAdmin={setIsAdmin}
                navigate={navigate}
                users={users}
                setUsers={setUsers}
                attendance={attendance}
                setAttendance={setAttendance}
                attendanceSession={attendanceSession}
                setAttendanceSession={setAttendanceSession}
                newUserForm={newUserForm}
                setNewUserForm={setNewUserForm}
                handleAddUser={handleAddUser}
                handleDeleteUser={handleDeleteUser}
                handleEditUser={handleEditUser}
                handleSaveEdit={handleSaveEdit}
                editUser={editUser}
                setEditUser={setEditUser}
                editForm={editForm}
                setEditForm={setEditForm}
                saveAttendanceSession={saveAttendanceSession}
              />
            </motion.div>
          ) : (
            <Navigate to="/admin-login" replace />
          )
        } />
      </Routes>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg ${
              popupType === 'success' ? 'border-green-500' :
              popupType === 'error' ? 'border-red-500' :
              popupType === 'confirm' ? 'border-yellow-500' :
              'border-blue-500'
            } border-l-4`}
          >
            <div className="flex items-center mb-4">
              {popupType === 'success' && (
                <div className="text-green-500 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {popupType === 'error' && (
                <div className="text-red-500 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {popupType === 'info' && (
                <div className="text-blue-500 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {popupType === 'confirm' && (
                <div className="text-yellow-500 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <h3 className={`text-lg font-semibold ${
                popupType === 'success' ? 'text-green-700' :
                popupType === 'error' ? 'text-red-700' :
                popupType === 'confirm' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                {popupType === 'success' ? 'Success' :
                 popupType === 'error' ? 'Error' :
                 popupType === 'confirm' ? 'Confirm' :
                 'Info'}
              </h3>
            </div>
            <p className="text-gray-700 mb-6">{popupMessage}</p>
            {popupType === 'confirm' ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setPendingDeleteUserId(null);
                  }}
                  className="flex-1 py-2 px-4 rounded-md font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    confirmDeleteUser();
                  }}
                  className="flex-1 py-2 px-4 rounded-md font-medium transition-colors bg-red-500 hover:bg-red-600 text-white"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowPopup(false);
                  if (popupMessage === 'Registration successful! Please login.') {
                    navigate('/login');
                  }
                }}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  popupType === 'success' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  popupType === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' :
                  'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                OK
              </button>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
