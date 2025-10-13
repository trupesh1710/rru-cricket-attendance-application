import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
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
  // Global state
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendance, setAttendance] = useState([]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
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
  const [page, setPage] = useState('login');
  const [showPassword, setShowPassword] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [resetForm, setResetForm] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '' });

  // Admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

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
        alert('Invalid email or password');
        return;
      }

      setCurrentUser(data);
      setPage('user-dashboard');
      setLoginForm({ email: '', password: '' });
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegister = async () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', registerForm.email)
        .single();

      if (existingUser) {
        alert('Email already registered');
        return;
      }

      // Insert new user
      const { data, error } = await supabase
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

      alert('Registration successful! Please login.');
      setPage('login');
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      setError('');
      fetchUsers(); // Refresh users list
    } catch (err) {
      setError(err.message);
      alert('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password: resetForm.newPassword })
        .eq('email', resetForm.email)
        .select();

      if (error) throw error;

      if (data.length === 0) {
        alert('Email not found');
        return;
      }

      alert('Password reset successful!');
      setPage('login');
      setResetForm({ email: '', newPassword: '', confirmPassword: '' });
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Password reset failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!attendanceSession.active) {
      alert('No active attendance session');
      return;
    }
    if (!userLocation) {
      alert('Please enable location services');
      return;
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      attendanceSession.location.lat,
      attendanceSession.location.lng
    );

    const alreadyMarked = attendance.find(
      a => a.user_id === currentUser.id && a.date === new Date().toISOString().split('T')[0]
    );
    if (alreadyMarked) {
      alert('Attendance already marked for today');
      return;
    }

    const status = distance > attendanceSession.radius ? 'Absent' : 'Present';

    try {
      const { data, error } = await supabase
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
      alert(`Attendance marked as ${status}!`);
    } catch (err) {
      console.error('Error marking attendance:', err);
      alert('Failed to mark attendance: ' + err.message);
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
        alert('Invalid admin credentials');
        return;
      }

      setIsAdmin(true);
      setPage('admin-dashboard');
      setAdminLogin({ username: '', password: '' });
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Admin login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUserForm.email)
        .single();

      if (existingUser) {
        alert('Email already exists');
        return;
      }

      // Insert new user
      const { data, error } = await supabase
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
      alert('User added successfully');
      fetchUsers(); // Refresh users list
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Failed to add user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        // Delete attendance records first
        const { error: attendanceError } = await supabase
          .from('attendance')
          .delete()
          .eq('user_id', userId);

        if (attendanceError) throw attendanceError;

        // Then delete the user
        const { error: userError } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (userError) throw userError;

        fetchUsers(); // Refresh users list
        fetchAttendance(); // Refresh attendance list
        setError('');
      } catch (err) {
        setError(err.message);
        alert('Failed to delete user: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user.id);
    setEditForm({ name: user.name, email: user.email, password: user.password });
  };

  const handleSaveEdit = async () => {
    setLoading(true);
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
      alert('User updated successfully');
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Failed to update user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save attendance session to Supabase
  const saveAttendanceSession = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('attendance_sessions')
        .update({
          active: attendanceSession.active,
          location_lat: attendanceSession.location.lat,
          location_lng: attendanceSession.location.lng,
          radius: attendanceSession.radius,
          area: attendanceSession.area
        })
        .eq('id', 1);

      if (error) throw error;

      alert('Attendance session settings saved successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      alert('Failed to save attendance session settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (page === 'login') {
    return <LoginPage loginForm={loginForm} setLoginForm={setLoginForm} showPassword={showPassword} setShowPassword={setShowPassword} handleUserLogin={handleUserLogin} setPage={setPage} />;
  }

  if (page === 'register') {
    return <RegisterPage registerForm={registerForm} setRegisterForm={setRegisterForm} showPassword={showPassword} setShowPassword={setShowPassword} handleUserRegister={handleUserRegister} setPage={setPage} />;
  }

  if (page === 'reset-password') {
    return <ResetPasswordPage resetForm={resetForm} setResetForm={setResetForm} showPassword={showPassword} setShowPassword={setShowPassword} handleResetPassword={handleResetPassword} setPage={setPage} />;
  }

  if (page === 'user-dashboard' && currentUser) {
    return <UserDashboard 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
      setPage={setPage} 
      attendance={attendance} 
      attendanceSession={attendanceSession} 
      userLocation={userLocation} 
      setUserLocation={setUserLocation} 
      locationError={locationError} 
      setLocationError={setLocationError} 
      getUserLocation={getUserLocation} 
      calculateDistance={calculateDistance} 
      handleMarkAttendance={handleMarkAttendance} 
    />;
  }

  if (page === 'admin-login') {
    return <AdminLoginPage adminLogin={adminLogin} setAdminLogin={setAdminLogin} showPassword={showPassword} setShowPassword={setShowPassword} handleAdminLogin={handleAdminLogin} setPage={setPage} />;
  }

  if (page === 'admin-dashboard' && isAdmin) {
    return <AdminDashboard
      setIsAdmin={setIsAdmin}
      setPage={setPage}
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
    />;
  }

  return null;
}
