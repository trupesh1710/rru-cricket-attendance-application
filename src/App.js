import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import UserDashboard from './components/UserDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';

export default function AttendanceApp() {
  // Global state
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'Ali Khan', email: 'ali@rru.com', password: 'pass123' },
    { id: 2, name: 'Sara Ahmed', email: 'sara@rru.com', password: 'pass123' }
  ]);
  const [attendance, setAttendance] = useState([
    { id: 1, userId: 1, date: '2025-10-10', time: '10:30 AM', status: 'Present', location: 'Ground A' },
    { id: 2, userId: 2, date: '2025-10-10', time: '10:45 AM', status: 'Present', location: 'Ground A' }
  ]);
  const [attendanceSession, setAttendanceSession] = useState({
    active: true,
    location: { lat: 31.5497, lng: 74.3436 },
    radius: 100,
    area: 'RRU Cricket Ground'
  });

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
  const handleUserLogin = () => {
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setPage('user-dashboard');
      setLoginForm({ email: '', password: '' });
    } else {
      alert('Invalid email or password');
    }
  };

  const handleUserRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      alert('Please fill all fields');
      return;
    }
    if (users.find(u => u.email === registerForm.email)) {
      alert('Email already registered');
      return;
    }
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    };
    setUsers([...users, newUser]);
    alert('Registration successful! Please login.');
    setPage('login');
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleResetPassword = () => {
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const user = users.find(u => u.email === resetForm.email);
    if (!user) {
      alert('Email not found');
      return;
    }
    const updatedUsers = users.map(u =>
      u.email === resetForm.email ? { ...u, password: resetForm.newPassword } : u
    );
    setUsers(updatedUsers);
    alert('Password reset successful!');
    setPage('login');
    setResetForm({ email: '', newPassword: '', confirmPassword: '' });
  };

  const handleMarkAttendance = () => {
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
      a => a.userId === currentUser.id && a.date === new Date().toISOString().split('T')[0]
    );
    if (alreadyMarked) {
      alert('Attendance already marked for today');
      return;
    }

    const status = distance > attendanceSession.radius ? 'Absent' : 'Present';

    const newAttendance = {
      id: Math.max(...attendance.map(a => a.id), 0) + 1,
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: status,
      location: attendanceSession.area
    };
    setAttendance([...attendance, newAttendance]);
    alert(`Attendance marked as ${status}!`);
  };

  // ADMIN FUNCTIONS
  const handleAdminLogin = () => {
    if (adminLogin.username === ADMIN_USERNAME && adminLogin.password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPage('admin-dashboard');
      setAdminLogin({ username: '', password: '' });
    } else {
      alert('Invalid admin credentials');
    }
  };

  const handleAddUser = () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      alert('Please fill all fields');
      return;
    }
    if (users.find(u => u.email === newUserForm.email)) {
      alert('Email already exists');
      return;
    }
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: newUserForm.name,
      email: newUserForm.email,
      password: newUserForm.password
    };
    setUsers([...users, newUser]);
    setNewUserForm({ name: '', email: '', password: '' });
    alert('User added successfully');
  };

  const handleDeleteUser = (userId) => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
      setAttendance(attendance.filter(a => a.userId !== userId));
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user.id);
    setEditForm({ name: user.name, email: user.email, password: user.password });
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map(u =>
      u.id === editUser ? { ...u, name: editForm.name, email: editForm.email, password: editForm.password } : u
    );
    setUsers(updatedUsers);
    setEditUser(null);
    setEditForm({ name: '', email: '', password: '' });
    alert('User updated successfully');
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
    />;
  }

  return null;
}
