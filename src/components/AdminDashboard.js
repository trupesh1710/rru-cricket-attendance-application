import React, { useState } from 'react';
import { LogOut, Plus, Users, Calendar, Edit2, Trash2, Zap, Download, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminDashboard({
  setIsAdmin,
  setPage,
  users,
  setUsers,
  attendance,
  setAttendance,
  attendanceSession,
  setAttendanceSession,
  newUserForm,
  setNewUserForm,
  handleAddUser,
  handleDeleteUser,
  handleEditUser,
  handleSaveEdit,
  editUser,
  setEditUser,
  editForm,
  setEditForm,
  saveAttendanceSession
}) {
  const [filterDate, setFilterDate] = useState('');
  const [showPasswords, setShowPasswords] = useState({});

  const handleDownloadExcel = () => {
    const filteredAttendance = attendance.filter(record => !filterDate || record.date === filterDate);
    const data = filteredAttendance.map(record => {
      const user = users.find(u => u.id === record.user_id);
      return {
        'Player Name': user?.name || 'Unknown',
        'Date': record.date,
        'Time': record.time,
        'Status': record.status,
        'Location': record.location
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Records');
    XLSX.writeFile(wb, `attendance_records${filterDate ? `_${filterDate}` : ''}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <nav className="bg-gradient-to-r from-gray-900 via-orange-700 to-red-700 text-white p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/rru-logo.png" alt="RRU Logo" className="w-10 h-10" />
            <h1 className="text-1xl md:text-3xl font-black">⚙️ RRU CRICKET ADMIN</h1>
          </div>
          <button
            onClick={() => {
              setIsAdmin(false);
              setPage('login');
            }}
            className="flex items-center gap-2 bg-red-700 px-5 py-2 rounded-full hover:bg-red-800 font-bold shadow-lg"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 space-y-6 pb-10">
        {/* Add User Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border-2 border-orange-500">
          <h2 className="text-2xl font-black mb-4 text-orange-400 flex items-center gap-2">
            <Plus size={28} /> ADD NEW PLAYER
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Player Name"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              className="px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-semibold placeholder-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              className="px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-semibold placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              className="px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-semibold placeholder-gray-400"
            />
            <button
              onClick={handleAddUser}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-black shadow-lg transform hover:scale-105 transition"
            >
              ➕ ADD PLAYER
            </button>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-500">
          <h2 className="text-2xl font-black mb-4 text-blue-400 flex items-center gap-2">
            <Users size={28} /> MANAGE PLAYERS
          </h2>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-700 to-blue-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-black">Name</th>
                  <th className="px-4 py-3 text-left text-white font-black">Email</th>
                  <th className="px-4 py-3 text-left text-white font-black">Password</th>
                  <th className="px-4 py-3 text-left text-white font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.role === 'user').map(user => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td className="px-4 py-3 text-white font-bold">
                      {editUser === user.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-2 py-1 border border-gray-500 rounded bg-gray-600 text-white"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="px-4 py-3 text-white font-bold">
                      {editUser === user.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="px-2 py-1 border border-gray-500 rounded bg-gray-600 text-white"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-4 py-3 text-white font-bold flex items-center gap-2">
                      {editUser === user.id ? (
                        <input
                          type="password"
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          className="px-2 py-1 border border-gray-500 rounded bg-gray-600 text-white"
                        />
                      ) : (
                        <>
                          {showPasswords[user.id] ? user.password : '••••••'}
                          <button
                            onClick={() => setShowPasswords(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {editUser === user.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm font-bold"
                          >
                            ✅ Save
                          </button>
                          <button
                            onClick={() => setEditUser(null)}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm font-bold"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm inline-flex items-center gap-1 font-bold"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm inline-flex items-center gap-1 font-bold"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        {/* Attendance Records */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border-2 border-green-500">
          <h2 className="text-2xl font-black mb-4 text-green-400 flex items-center gap-2">
            <Calendar size={28} /> ATTENDANCE RECORDS
          </h2>

          <div className="mb-4 flex gap-4 items-center">
            <label className="text-green-300 font-black">Filter by Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border-2 border-green-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-bold"
            />
            <button
              onClick={handleDownloadExcel}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 font-black shadow-lg transform hover:scale-105 transition inline-flex items-center gap-2"
            >
              <Download size={20} /> DOWNLOAD EXCEL
            </button>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-700 to-green-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-black">Player Name</th>
                  <th className="px-4 py-3 text-left text-white font-black">Date</th>
                  <th className="px-4 py-3 text-left text-white font-black hidden md:table-cell">Time</th>
                  <th className="px-4 py-3 text-left text-white font-black">Status</th>
                  <th className="px-4 py-3 text-left text-white font-black hidden md:table-cell">Location</th>
                </tr>
              </thead>
              <tbody>
                {attendance
                  .filter(record => !filterDate || record.date === filterDate)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(record => {
                    const user = users.find(u => u.id === record.user_id);
                    return (
                      <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                        <td className="px-4 py-3 text-white font-bold">{user?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-white font-bold">{record.date}</td>
                        <td className="px-4 py-3 text-white font-bold hidden md:table-cell">{record.time}</td>
                        <td className="px-4 py-3">
                          {record.status === 'Present' ? (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded font-black">
                              <span className="md:hidden">✅</span>
                              <span className="hidden md:inline">✅ Present</span>
                            </span>
                          ) : (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded font-black">
                              <span className="md:hidden">❌</span>
                              <span className="hidden md:inline">❌ Absent</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white font-bold hidden md:table-cell">{record.location}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {attendance.length === 0 && (
            <p className="text-gray-400 text-center py-8 font-bold text-lg">No attendance records yet</p>
          )}
        </div>

        {/* Attendance Session Settings */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border-2 border-purple-500">
          <h2 className="text-2xl font-black mb-4 text-purple-400 flex items-center gap-2">
            🎛️ ATTENDANCE SESSION SETTINGS
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-black mb-2">Area Name</label>
                <input
                  type="text"
                  value={attendanceSession.area}
                  onChange={(e) => setAttendanceSession({ ...attendanceSession, area: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-black mb-2">Allowed Radius (meters)</label>
                <input
                  type="number"
                  value={attendanceSession.radius}
                  onChange={(e) => setAttendanceSession({ ...attendanceSession, radius: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-black mb-2">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={attendanceSession.location.lat}
                  onChange={(e) => setAttendanceSession({
                    ...attendanceSession,
                    location: { ...attendanceSession.location, lat: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-black mb-2">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={attendanceSession.location.lng}
                  onChange={(e) => setAttendanceSession({
                    ...attendanceSession,
                    location: { ...attendanceSession.location, lng: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendanceSession.active}
                  onChange={(e) => setAttendanceSession({ ...attendanceSession, active: e.target.checked })}
                  className="w-6 h-6 accent-purple-500"
                />
                <span className="text-white font-black text-lg">Attendance Session Active</span>
              </label>
            </div>

            <button
              onClick={saveAttendanceSession}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 font-black text-lg shadow-lg transform hover:scale-105 transition"
            >
              💾 SAVE SETTINGS
            </button>
          </div>

          <div className="mt-6 bg-gray-700 border-2 border-purple-500 rounded-xl p-4">
            <p className="text-purple-300 font-black text-lg">⚙️ CURRENT SETTINGS</p>
            <p className="text-white mt-2 font-bold">📍 Area: {attendanceSession.area}</p>
            <p className="text-white font-bold">🗺️ Location: {attendanceSession.location.lat.toFixed(4)}, {attendanceSession.location.lng.toFixed(4)}</p>
            <p className="text-white font-bold">📏 Radius: {attendanceSession.radius}m</p>
            <p className="text-white font-bold">Status: <span className={attendanceSession.active ? 'text-green-400 font-black' : 'text-red-400 font-black'}>
              {attendanceSession.active ? '🟢 ACTIVE' : '🔴 INACTIVE'}
            </span></p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 border-2 border-blue-400 text-white text-center">
            <p className="text-lg font-black text-blue-100">TOTAL PLAYERS</p>
            <p className="text-5xl font-black mt-4 text-yellow-300">{users.filter(u => u.role === 'user').length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl p-6 border-2 border-green-400 text-white text-center">
            <p className="text-lg font-black text-green-100">TOTAL ATTENDANCE</p>
            <p className="text-5xl font-black mt-4 text-yellow-300">{attendance.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
