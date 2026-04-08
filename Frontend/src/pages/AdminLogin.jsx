import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Static login credentials
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin@123';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('adminToken', 'true');
      navigate('/admin-panel');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse transition-all duration-3000 delay-500"></div>
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse transition-all duration-3000 delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="glass-dark p-10 rounded-3xl w-full max-w-md relative z-10 shadow-2xl border border-slate-700/50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <span className="text-4xl font-bold text-white">M</span>
          </div>
          <h2 className="text-4xl font-bold text-white">Admin Portal</h2>
          <p className="text-slate-400 mt-3">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@gmail.com"
                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Password</label>
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full group bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Sign In
            <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Unauthorized access is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
