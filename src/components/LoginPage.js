import React from 'react';
import { Trophy, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ loginForm, setLoginForm, showPassword, setShowPassword, handleUserLogin, setPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-yellow-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-700 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-300 rounded-full opacity-10 blur-3xl"></div>

      <div className="w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 relative z-10 border-2 border-orange-300">
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-orange-600 to-red-600 p-4 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">RRU CRICKET</h1>
          <p className="text-gray-600 mt-2 font-semibold">Attendance Management System</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Player Login</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
          />
          <div className="relative">
            <input
              type={showPassword.login ? 'text' : 'password'}
              placeholder="🔐 Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword.login ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleUserLogin}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 font-bold text-lg shadow-lg transform hover:scale-105 transition"
          >
            🏏 LOGIN TO GROUND
          </button>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => setPage('register')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 font-semibold shadow-md"
          >
            Join The Team
          </button>
          <button
            onClick={() => setPage('reset-password')}
            className="w-full text-orange-600 hover:text-orange-800 font-semibold underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-gray-300">
          <button
            onClick={() => setPage('admin-login')}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2 rounded-lg hover:from-gray-900 hover:to-black font-semibold shadow-lg"
          >
            ⚙️ Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}
