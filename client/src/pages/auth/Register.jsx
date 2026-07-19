import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/Logo';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    const result = await register({ username, email, password });
    if (result.success) {
      setSuccess('Account created! Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const perks = [
    'Free forever developer workspace',
    'Full API Builder with request runner',
    'Real-time team collaboration sync',
    'Unlimited collection endpoint storage',
  ];

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — Brand & Perks */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #D8C3F2 0%, #F4B183 60%, #FFD89C 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute bottom-10 -left-16 w-80 h-80 bg-white/10 rounded-full" />

        <div className="relative z-10 flex items-center gap-3">
          <Logo size={36} />
          <span className="text-2xl font-extrabold font-poppins text-white drop-shadow">APIForge</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold font-poppins text-white leading-tight drop-shadow-sm">
              Build your API workspace<br />in minutes.
            </h2>
            <p className="mt-4 text-white/80 text-base leading-relaxed max-w-sm">
              Join thousands of developers using APIForge to streamline endpoint workflows and ship with confidence.
            </p>
          </div>

          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white text-sm font-medium">
                <HiOutlineCheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-white/60 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-white/90 font-semibold hover:underline">Sign in here</Link>
        </div>
      </div>

      {/* RIGHT PANEL — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-primary-bg">
        <div className="w-full max-w-md space-y-8">
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <Logo size={28} />
            <span className="font-poppins font-bold text-lg text-text-primary">APIForge</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold font-poppins text-text-primary">Create your account</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/30 text-success rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
              <HiOutlineCheckCircle className="h-5 w-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-primary">Username</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-borders bg-white text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-text-primary">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-borders bg-white text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        password.length >= level * 2
                          ? password.length >= 8 ? 'bg-success' : 'bg-warning'
                          : 'bg-borders'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <HiOutlineArrowRight className="h-4 w-4" /></>
              )}
            </button>

            <p className="text-center text-xs text-text-muted">
              By registering, you agree to our{' '}
              <span className="text-primary font-semibold cursor-pointer hover:underline">Terms of Service</span>{' '}
              and{' '}
              <span className="text-primary font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
