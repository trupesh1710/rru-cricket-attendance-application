import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage({ resetForm, setResetForm, showPassword, setShowPassword, handleResetPassword, setPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-yellow-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-300">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Reset Password</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="📧 Email"
            value={resetForm.email}
            onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
          />
          <div className="relative">
            <input
              type={showPassword.reset ? 'text' : 'password'}
              placeholder="🔐 New Password"
              value={resetForm.newPassword}
              onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, reset: !showPassword.reset })}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword.reset ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword.confirmReset ? 'text' : 'password'}
              placeholder="✅ Confirm Password"
              value={resetForm.confirmPassword}
              onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, confirmReset: !showPassword.confirmReset })}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword.confirmReset ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleResetPassword}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 font-bold text-lg shadow-lg"
          >
            Reset Password
          </button>
        </div>

        <button
          onClick={() => setPage('login')}
          className="w-full mt-4 text-orange-600 hover:text-orange-800 font-semibold underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
