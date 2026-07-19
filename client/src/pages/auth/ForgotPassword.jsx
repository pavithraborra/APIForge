import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineArrowLeft } from 'react-icons/hi';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      // For security, still show success to avoid email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF8F3 0%, #FFF2EA 50%, #F7D9C4 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem 1rem',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,177,131,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,195,242,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 24px 64px rgba(0,0,0,0.10)',
        border: '1.5px solid #F1D6C8',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Back link */}
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#A0958D', fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
          <HiOutlineArrowLeft style={{ width: 16, height: 16 }} />
          Back to Sign In
        </Link>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(136,201,161,0.12)', border: '2px solid rgba(136,201,161,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <HiOutlineCheckCircle style={{ width: 36, height: 36, color: '#88C9A1' }} />
            </div>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 26, fontWeight: 800, color: '#2F2A28', margin: '0 0 10px' }}>Check your email</h1>
            <p style={{ fontSize: 15, color: '#706864', lineHeight: 1.65, margin: '0 0 28px' }}>
              If an account exists for <strong style={{ color: '#2F2A28' }}>{email}</strong>, we've sent a password reset link to that address.
            </p>
            <p style={{ fontSize: 13, color: '#A0958D', margin: '0 0 24px' }}>
              Didn't receive it? Check your spam folder, or{' '}
              <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: '#F4B183', fontWeight: 700, fontSize: 13, cursor: 'pointer', padding: 0 }}>
                try again
              </button>
              .
            </p>
            <Link to="/login">
              <button style={{ background: '#F4B183', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(244,177,131,0.3)' }}>
                Return to Sign In
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Logo & heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Logo size={28} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: '#2F2A28' }}>APIForge</span>
            </div>
            <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 28, fontWeight: 800, color: '#2F2A28', margin: '0 0 8px' }}>Forgot your password?</h1>
            <p style={{ fontSize: 14, color: '#706864', margin: '0 0 32px', lineHeight: 1.6 }}>
              No worries. Enter your email and we'll send you a link to reset it.
            </p>

            {error && (
              <div style={{ background: 'rgba(233,122,122,0.1)', border: '1px solid rgba(233,122,122,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#9b2335', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2F2A28', marginBottom: 8 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <HiOutlineMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#A0958D' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    style={{
                      width: '100%', boxSizing: 'border-box', paddingLeft: 44, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                      borderRadius: 12, border: '1.5px solid #F1D6C8', fontSize: 14, color: '#2F2A28',
                      background: '#FFF8F3', outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#F4B183'}
                    onBlur={(e) => e.target.style.borderColor = '#F1D6C8'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#F7D6BF' : '#F4B183',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '13px 0', fontWeight: 700, fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(244,177,131,0.35)',
                  transition: 'background 0.2s',
                }}
              >
                {loading
                  ? <span style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.4)', borderTop: '2.5px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  : 'Send Reset Link'
                }
              </button>
            </form>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
