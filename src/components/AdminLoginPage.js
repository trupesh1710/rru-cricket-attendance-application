import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage({ adminLogin, setAdminLogin, showPassword, setShowPassword, handleAdminLogin, setPage, loading }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border-2 border-orange-500 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full mb-4">
            <img src="/rru-logo.png" alt="RRU Logo" className="w-20 h-20" />
          </div>
          <h2 className="text-3xl font-black text-white">ADMIN CONTROL</h2>
          <p className="text-orange-400 mt-2 font-bold">Management Panel</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="👤 Username"
            value={adminLogin.username}
            onChange={(e) => setAdminLogin({ ...adminLogin, username: e.target.value })}
            className="w-full px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-semibold placeholder-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword.admin ? 'text' : 'password'}
              placeholder="🔐 Password"
              value={adminLogin.password}
              onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-orange-500 rounded-lg focus:outline-none focus:border-yellow-400 bg-gray-700 text-white font-semibold placeholder-gray-400"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, admin: !showPassword.admin })}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
            >
              {showPassword.admin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 font-bold text-lg shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : '🔓 ENTER ADMIN PANEL'}
          </button>
        </div>

        <button
          onClick={() => setPage('login')}
          className="w-full mt-4 text-orange-400 hover:text-orange-300 font-semibold underline"
        >
          Back to User Login
        </button>
      </div>
    </div>
  );
}
