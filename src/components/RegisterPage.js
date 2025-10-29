import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage({ registerForm, setRegisterForm, showPassword, setShowPassword, handleUserRegister, navigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-yellow-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-300">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Join Our Team</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="👤 Full Name"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
          />
          <input
            type="email"
            placeholder="📧 Email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
          />
          <div className="relative">
            <input
              type={showPassword.register ? 'text' : 'password'}
              placeholder="🔐 Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword.register ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword.confirmReg ? 'text' : 'password'}
              placeholder="✅ Confirm Password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 font-semibold"
            />
            <button
              onClick={() => setShowPassword({ ...showPassword, confirmReg: !showPassword.confirmReg })}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword.confirmReg ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleUserRegister}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-lg"
          >
            Register Now
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-4 text-orange-600 hover:text-orange-800 font-semibold underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
