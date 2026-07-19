import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/Logo';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login({ email, password });
    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  const fillDemo = () => {
    setEmail('sarah.chen@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F4B183 0%, #F7D6BF 50%, #D8C3F2 100%)' }}
      >
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-white/10 rounded-full" />
        <div className="absolute top-1/3 right-0 w-48 h-48 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-center gap-3">
          <Logo size={36} />
          <span className="text-2xl font-extrabold font-poppins text-white drop-shadow">APIForge</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold font-poppins text-white leading-tight drop-shadow-sm">
              The API workspace<br />your team deserves.
            </h2>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-sm">
              Run endpoints, manage environments, collaborate in real-time, and ship robust APIs faster than ever before.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['Real-time Sync', 'JWT Auth', 'Environment Keys', 'Team Roles'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                <span className="text-sm text-white font-semibold">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-xs">
          © {new Date().getFullYear()} APIForge. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-bg">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <Logo size={28} />
            <span className="font-poppins font-bold text-lg text-text-primary">APIForge</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold font-poppins text-text-primary">Welcome back</h1>
            <p className="mt-2 text-sm text-text-secondary">
              New to APIForge?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
            </p>
          </div>

          {/* Error / Success Alerts */}
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/30 text-success rounded-xl px-4 py-3 text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-primary">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-borders bg-white text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-text-primary">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-borders bg-white text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <HiOutlineArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="border border-borders rounded-xl bg-white p-4 space-y-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Demo Account</p>
            <p className="text-xs text-text-secondary">
              <span className="font-semibold">Email:</span> sarah.chen@example.com
            </p>
            <p className="text-xs text-text-secondary">
              <span className="font-semibold">Password:</span> password123
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs font-semibold text-primary hover:underline mt-1"
            >
              Auto-fill demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
