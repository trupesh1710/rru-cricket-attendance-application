import React from 'react';
import { LogOut, MapPin, Calendar } from 'lucide-react';

export default function UserDashboard({
  currentUser,
  setCurrentUser,
  setPage,
  attendance,
  attendanceSession,
  userLocation,
  setUserLocation,
  locationError,
  setLocationError,
  getUserLocation,
  calculateDistance,
  handleMarkAttendance,
  handleCombinedAction
}) {
  const userAttendance = attendance.filter(a => a.user_id === currentUser.id);
  const sortedUserAttendance = userAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));
  const presentCount = sortedUserAttendance.filter(a => a.status === 'Present').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <nav className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 text-white p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-white text-orange-600 rounded-full flex items-center justify-center font-black">🏏</span>
            <h1 className="text-3xl font-black">RRU CRICKET</h1>
          </div>
          <button
            onClick={() => {
              setCurrentUser(null);
              setPage('login');
            }}
            className="flex items-center gap-2 bg-red-700 px-5 py-2 rounded-full hover:bg-red-800 font-bold shadow-lg"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 space-y-6 pb-10">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl p-8 text-white border-4 border-orange-300">
          <h2 className="text-4xl font-black mb-2">Welcome Back, {currentUser.name}! 🎉</h2>
          <p className="text-lg opacity-90">Ready to mark your attendance today?</p>
          <div className="mt-4 text-sm opacity-75">Email: {currentUser.email}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-black mb-4 text-orange-600 flex items-center gap-2">
              <MapPin size={28} /> MARK ATTENDANCE
            </h3>

            {attendanceSession.active ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-4">
                  <p className="font-black text-green-700 text-lg">✅ ATTENDANCE ACTIVE</p>
                  <p className="text-sm text-green-700 mt-2 font-semibold">📍 {attendanceSession.area}</p>
                  <p className="text-sm text-green-700 font-semibold">📏 Radius: {attendanceSession.radius}m</p>
                </div>

                {locationError && (
                  <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3 text-red-700 text-sm font-semibold">
                    ❌ {locationError}
                  </div>
                )}

                {userLocation && (
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-3 text-blue-700 text-sm font-semibold">
                    <p>📍 Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                    <p className="mt-2 text-lg font-black">
                      Distance: {calculateDistance(userLocation.lat, userLocation.lng, attendanceSession.location.lat, attendanceSession.location.lng).toFixed(2)}m
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCombinedAction}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 font-black text-xl shadow-lg transform hover:scale-105 transition"
                >
                   MARK ATTENDANCE
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 text-yellow-800 font-bold text-center text-lg">
                ⚠️ No Active Session
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
            <h3 className="text-2xl font-black mb-4 text-green-600 flex items-center gap-2">
              <Calendar size={28} /> MY RECORDS
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3 border-2 border-green-300 text-center">
                <p className="text-sm font-bold text-gray-700">Total Present</p>
                <p className="text-3xl font-black text-green-600">{presentCount}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-3 border-2 border-blue-300 text-center">
                <p className="text-sm font-bold text-gray-700">Total Records</p>
                <p className="text-3xl font-black text-blue-600">{sortedUserAttendance.length}</p>
              </div>
            </div>

            {sortedUserAttendance.length > 0 ? (
              <>
                <div className="border-2 border-orange-500 rounded-xl p-4 bg-gradient-to-r from-orange-100 to-yellow-100 mb-4">
                  <p className="font-black text-orange-800 text-lg mb-2">📅 Latest Record</p>
                  <p className="font-black text-orange-700 text-lg">📅 {sortedUserAttendance[0].date}</p>
                  <p className="text-sm text-gray-700 mt-1">🕐 {sortedUserAttendance[0].time}</p>
                  <p className="text-sm text-gray-700">{sortedUserAttendance[0].status === 'Present' ? '✅' : '❌'} <span className={`font-black ${sortedUserAttendance[0].status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>{sortedUserAttendance[0].status}</span></p>
                  <p className="text-sm text-gray-700">📍 {sortedUserAttendance[0].location}</p>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sortedUserAttendance.slice(1).map(record => (
                    <div key={record.id} className="border-2 border-orange-300 rounded-xl p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
                      <p className="font-black text-orange-700 text-lg">📅 {record.date}</p>
                      <p className="text-sm text-gray-700 mt-1">🕐 {record.time}</p>
                      <p className="text-sm text-gray-700">{record.status === 'Present' ? '✅' : '❌'} <span className={`font-black ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>{record.status}</span></p>
                      <p className="text-sm text-gray-700">📍 {record.location}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 font-bold text-lg">
                📊 No Records Yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
