import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo';
import {
  HiOutlineCube, HiOutlineTerminal, HiOutlineUsers,
  HiOutlineClock, HiOutlineChevronDown, HiOutlineAdjustments,
  HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineCheckCircle,
  HiOutlineX, HiOutlineArrowRight, HiOutlineStar
} from 'react-icons/hi';

/* ───────────────────────────── DATA ────────────────────────────── */
const features = [
  { icon: HiOutlineCube,        title: 'Workspace Management',     desc: 'Isolate endpoints, configs, and collections into distinct workspaces per project or client.' },
  { icon: HiOutlineTerminal,    title: 'API Builder',               desc: 'Build, test, and inspect complex requests. Headers, body, params, auth — all in one view.' },
  { icon: HiOutlineUsers,       title: 'Real-Time Collaboration',   desc: 'See which teammates are online. Changes sync instantly across all active sessions.' },
  { icon: HiOutlineAdjustments, title: 'Environment Variables',     desc: 'Separate dev, staging, and production configs. Inject secrets safely without hardcoding.' },
  { icon: HiOutlineClock,       title: 'Full Request History',      desc: 'Never lose a run. Browse paginated history filtered by status, method, or timestamp.' },
  { icon: HiOutlineShieldCheck, title: 'Team Roles & Permissions',  desc: 'Define Owner, Admin, Developer, and Viewer access with fine-grained workspace controls.' },
];

const stats = [
  { value: '10K+', label: 'Requests / Day' },
  { value: '500+', label: 'Teams Onboarded' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50+',  label: 'Integrations' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Lead API Engineer, NovaTech',
    avatar: 'SC',
    quote: 'APIForge replaced three separate tools for our team. The real-time sync during standups is a game-changer.',
    color: '#F4B183'
  },
  {
    name: 'Marcus Rivera',
    role: 'CTO, BuildStack Labs',
    avatar: 'MR',
    quote: 'The environment variable management alone is worth it. Clean, secure, and exactly what we needed at scale.',
    color: '#D8C3F2'
  },
  {
    name: 'Aisha Patel',
    role: 'Backend Developer, Axiom Cloud',
    avatar: 'AP',
    quote: 'Beautiful interface and rock-solid performance. Our onboarding time dropped by 60% after switching.',
    color: '#88C9A1'
  },
];

const faqs = [
  { q: 'How does the real-time collaboration work?', a: 'APIForge uses WebSocket connections to instantly synchronise endpoints and environment parameters across all active sessions. Changes appear live for every team member in the workspace.' },
  { q: 'Can we manage secrets securely?', a: 'Yes. Secrets are stored encrypted and injected at runtime. Environment configs (Dev / Test / Prod) keep credentials out of version control entirely.' },
  { q: 'What are the limits on the Free tier?', a: 'Free includes up to 10 workspaces, 40 collections, and unlimited request executions. Pro unlocks team analytics, unlimited history, and priority support.' },
  { q: 'Does APIForge support Docker for local staging?', a: 'Absolutely. We provide Docker Compose templates for isolated local development, plus one-click hosting templates for Render, Vercel, and MongoDB Atlas.' },
  { q: 'How is billing handled for teams?', a: 'Team plans are billed per seat, per month, with annual discounts available. Owners manage billing; members simply get invited.' },
  { q: 'Is there an API or CLI to automate workflows?', a: 'Yes — our public REST API and CLI let you automate collection imports, run regression test suites in CI/CD pipelines, and export request snapshots.' },
];

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    cta: 'Get Started',
    ctaPath: '/register',
    features: ['10 workspaces', '40 collections', 'Unlimited requests', '1 environment per workspace', 'Community support'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per seat / mo',
    cta: 'Start Free Trial',
    ctaPath: '/register',
    features: ['Unlimited workspaces', 'Unlimited collections', 'Advanced analytics', 'Multiple environments', 'Priority support', 'Request history export'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    cta: 'Book a Demo',
    ctaPath: null,
    features: ['Everything in Pro', 'SSO / SAML support', 'Custom data retention', 'SLA guarantee', 'Dedicated success manager', 'Audit logs'],
    highlight: false,
  },
];

/* ───────────────────────── BOOK DEMO MODAL ─────────────────────── */
const DemoModal = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [teamSize, setTeamSize] = useState('1-10');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleClose = useCallback(() => {
    setSubmitted(false);
    setName(''); setEmail(''); setCompany(''); setTeamSize('1-10');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(47,42,40,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480,
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)', overflow: 'hidden',
          animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg,#F4B183,#D8C3F2)', padding: '24px 28px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' }}>
                Book a Demo
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                We'll reach out within 24 hours to schedule a live walkthrough.
              </p>
            </div>
            <button onClick={handleClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex', color: '#fff' }}>
              <HiOutlineX style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px 28px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <HiOutlineCheckCircle style={{ width: 56, height: 56, color: '#88C9A1', margin: '0 auto 16px' }} />
              <h3 style={{ margin: '0 0 8px', fontFamily: "'Poppins',sans-serif", fontSize: 20, fontWeight: 700, color: '#2F2A28' }}>
                You're on the list!
              </h3>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: '#706864', lineHeight: 1.6 }}>
                Thanks <strong>{name}</strong>! We'll reach out to <strong>{email}</strong> within 24 hours to confirm your demo slot.
              </p>
              <button
                onClick={handleClose}
                style={{
                  background: '#F4B183', color: '#fff', border: 'none',
                  borderRadius: 12, padding: '12px 32px',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(244,177,131,0.4)',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Jane Doe', required: true },
                { label: 'Work Email', value: email, setter: setEmail, type: 'email', placeholder: 'jane@company.com', required: true },
                { label: 'Company', value: company, setter: setCompany, type: 'text', placeholder: 'Acme Corp', required: false },
              ].map(({ label, value, setter, type, placeholder, required }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2F2A28', marginBottom: 6 }}>{label}</label>
                  <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F1D6C8',
                      fontSize: 14, color: '#2F2A28', background: '#FFF8F3', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#F4B183'}
                    onBlur={(e) => e.target.style.borderColor = '#F1D6C8'}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2F2A28', marginBottom: 6 }}>Team Size</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #F1D6C8',
                    fontSize: 14, color: '#2F2A28', background: '#FFF8F3', outline: 'none', appearance: 'none',
                  }}
                >
                  {['1-10', '11-50', '51-200', '200+'].map(s => <option key={s} value={s}>{s} people</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#F7D6BF' : '#F4B183',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '13px 0', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(244,177,131,0.35)',
                  transition: 'background 0.2s',
                  marginTop: 4,
                }}
              >
                {loading
                  ? <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTop: '2.5px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  : <>Schedule My Demo <HiOutlineArrowRight style={{ width: 16, height: 16 }} /></>
                }
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/* ──────────────────────────── MAIN PAGE ────────────────────────── */
const Landing = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F3', fontFamily: "'Inter',sans-serif", overflowX: 'hidden' }}>
      <DemoModal open={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* ── NAVBAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(255,248,243,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #F1D6C8',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={30} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: '#2F2A28' }}>APIForge</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 600, color: '#706864' }}>
            {['#features', '#how-it-works', '#pricing', '#faq'].map((href, i) => (
              <a key={href} href={href}
                style={{ textDecoration: 'none', color: '#706864', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#F4B183'}
                onMouseLeave={(e) => e.target.style.color = '#706864'}
              >
                {['Features', 'How It Works', 'Pricing', 'FAQ'][i]}
              </a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#706864', padding: '8px 16px', borderRadius: 10, transition: 'color 0.2s' }}>
              Sign In
            </Link>
            <Link to="/register">
              <button style={{
                background: '#F4B183', color: '#fff', border: 'none',
                borderRadius: 12, padding: '9px 22px', fontWeight: 700, fontSize: 14,
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(244,177,131,0.4)',
                transition: 'transform 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 72px', textAlign: 'center', position: 'relative' }}>
        {/* Gradient blobs */}
        <div style={{ position: 'absolute', top: -80, right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(244,177,131,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(216,195,242,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(244,177,131,0.12)', border: '1px solid rgba(244,177,131,0.35)', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#F4B183', marginBottom: 28 }}>
          <HiOutlineLightningBolt style={{ width: 14, height: 14 }} />
          APIForge 2.0 — Collaboration-First API Workspace
        </div>

        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 900, color: '#2F2A28', lineHeight: 1.1, margin: '0 0 24px' }}>
          Build, Test, and{' '}
          <span style={{ background: 'linear-gradient(135deg,#F4B183,#D8C3F2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Collaborate
          </span>
          <br />on APIs Faster
        </h1>

        <p style={{ fontSize: 18, color: '#706864', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 400 }}>
          The modern API workspace built for teams. Run endpoints, share environment secrets, manage collections, and ship with confidence.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{
              background: '#F4B183', color: '#fff', border: 'none',
              borderRadius: 14, padding: '14px 32px', fontWeight: 800, fontSize: 16,
              cursor: 'pointer', boxShadow: '0 8px 28px rgba(244,177,131,0.4)',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Start Building Free <HiOutlineArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </Link>
          <button
            onClick={() => setIsDemoOpen(true)}
            style={{
              background: '#fff', color: '#2F2A28', border: '2px solid #F1D6C8',
              borderRadius: 14, padding: '14px 32px', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F4B183'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#F1D6C8'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Book a Demo
          </button>
        </div>

        {/* Hero visual — browser mockup */}
        <div style={{
          marginTop: 64, borderRadius: 20, overflow: 'hidden',
          border: '1.5px solid #F1D6C8', boxShadow: '0 32px 80px rgba(0,0,0,0.1)',
          background: '#fff',
        }}>
          <div style={{ background: '#F7D9C4', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#E97A7A', '#F2B880', '#88C9A1'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#A0958D', marginLeft: 8 }}>
              localhost:3000/api-builder
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #FFF2EA 100%)', padding: '40px 32px', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #F1D6C8', width: 220, textAlign: 'left', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#A0958D', textTransform: 'uppercase', letterSpacing: 1 }}>Collections</p>
              {['User Auth API', 'Payment Endpoints', 'Webhook Handlers'].map(name => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #F7D9C4' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F4B183' }} />
                  <span style={{ fontSize: 13, color: '#2F2A28', fontWeight: 500 }}>{name}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #F1D6C8', flex: 1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ background: '#88C9A1', color: '#fff', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 800 }}>GET</span>
                <span style={{ fontSize: 13, color: '#706864', fontFamily: 'monospace' }}>https://api.example.com/users</span>
              </div>
              <div style={{ background: '#1e1e2e', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#cdd6f4', textAlign: 'left' }}>
                <span style={{ color: '#a6e3a1' }}>200 OK</span>{' ·  '}
                <span style={{ color: '#89b4fa' }}>142ms</span>{' ·  '}
                <span style={{ color: '#f38ba8' }}>application/json</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', borderTop: '1px solid #F1D6C8', borderBottom: '1px solid #F1D6C8', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 40, fontWeight: 900, color: '#F4B183' }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#A0958D', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2F2A28', margin: '0 0 12px' }}>Everything your team needs</h2>
          <p style={{ fontSize: 16, color: '#706864', maxWidth: 540, margin: '0 auto' }}>A purpose-built workspace that adapts to your workflow, not the other way around.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 20, padding: 28, border: '1.5px solid #F1D6C8',
              display: 'flex', flexDirection: 'column', gap: 14,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(244,177,131,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon style={{ width: 24, height: 24, color: '#F4B183' }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 17, fontWeight: 700, color: '#2F2A28', margin: 0 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#706864', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: 'linear-gradient(135deg, #FFF2EA, #FFF8F3)', padding: '80px 24px', borderTop: '1px solid #F1D6C8', borderBottom: '1px solid #F1D6C8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2F2A28', margin: '0 0 12px' }}>Get started in 3 steps</h2>
          <p style={{ fontSize: 16, color: '#706864', marginBottom: 56 }}>No configuration hell. You're running endpoints within minutes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, position: 'relative' }}>
            {[
              { step: '01', title: 'Create Your Workspace', desc: 'Set up a workspace for your project or team. Invite collaborators with role-based access.' },
              { step: '02', title: 'Build Collections', desc: 'Organise your endpoints into collections. Configure environments for dev, staging, and prod.' },
              { step: '03', title: 'Test & Collaborate', desc: 'Execute requests, inspect responses, and see team changes in real-time — together.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'left', position: 'relative' }}>
                <div style={{ fontFamily: "'Poppins',sans-serif", fontSize: 48, fontWeight: 900, color: 'rgba(244,177,131,0.25)', lineHeight: 1, marginBottom: 12 }}>{s.step}</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 18, fontWeight: 700, color: '#2F2A28', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#706864', margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2F2A28', textAlign: 'center', margin: '0 0 48px' }}>Teams love APIForge</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1.5px solid #F1D6C8', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array(5).fill(null).map((_, j) => <HiOutlineStar key={j} style={{ width: 16, height: 16, color: '#F4B183' }} />)}
              </div>
              <p style={{ fontSize: 15, color: '#2F2A28', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#2F2A28' }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#A0958D' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background: 'linear-gradient(135deg, #FFF2EA, #FFF8F3)', borderTop: '1px solid #F1D6C8', borderBottom: '1px solid #F1D6C8', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2F2A28', margin: '0 0 12px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 16, color: '#706864' }}>Start free. Scale when you're ready. No hidden fees.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {pricing.map((p, i) => (
              <div key={i} style={{
                background: p.highlight ? '#F4B183' : '#fff',
                borderRadius: 20, padding: '32px 28px', border: p.highlight ? '2px solid #F4B183' : '1.5px solid #F1D6C8',
                position: 'relative', boxShadow: p.highlight ? '0 16px 48px rgba(244,177,131,0.35)' : 'none',
                transform: p.highlight ? 'scale(1.03)' : 'none',
              }}>
                {p.highlight && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#2F2A28', color: '#fff', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 22, fontWeight: 800, color: p.highlight ? '#fff' : '#2F2A28', margin: '0 0 4px' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '16px 0' }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 40, fontWeight: 900, color: p.highlight ? '#fff' : '#F4B183' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.7)' : '#A0958D' }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.9)' : '#706864' }}>
                      <HiOutlineCheckCircle style={{ width: 16, height: 16, color: p.highlight ? '#fff' : '#88C9A1', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                {p.ctaPath ? (
                  <Link to={p.ctaPath}>
                    <button style={{
                      width: '100%', padding: '12px 0', borderRadius: 12,
                      background: p.highlight ? '#fff' : '#F4B183',
                      color: p.highlight ? '#F4B183' : '#fff',
                      border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}>{p.cta}</button>
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsDemoOpen(true)}
                    style={{
                      width: '100%', padding: '12px 0', borderRadius: 12,
                      background: '#F4B183', color: '#fff',
                      border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}>{p.cta}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 800, color: '#2F2A28', textAlign: 'center', margin: '0 0 48px' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #F1D6C8', overflow: 'hidden' }}>
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '18px 24px', background: 'none', border: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#2F2A28' }}>{faq.q}</span>
                <HiOutlineChevronDown style={{
                  width: 18, height: 18, color: '#A0958D', flexShrink: 0, marginLeft: 16,
                  transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.25s',
                }} />
              </button>
              {activeFaq === i && (
                <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#706864', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ margin: '0 24px 80px', borderRadius: 24, background: 'linear-gradient(135deg,#F4B183,#D8C3F2)', padding: '64px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 12px' }}>Ready to build better APIs?</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 36 }}>Join thousands of developers shipping faster with APIForge.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{ background: '#fff', color: '#F4B183', border: 'none', borderRadius: 14, padding: '14px 36px', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              Get Started Free
            </button>
          </Link>
          <button onClick={() => setIsDemoOpen(true)} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 14, padding: '14px 36px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Book a Demo
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#2F2A28', color: '#A0958D', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Logo size={24} />
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18, color: '#fff' }}>APIForge</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260, margin: 0 }}>The collaborative API workspace for modern engineering teams.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'API Builder', 'Environments', 'Request History'] },
              { title: 'Resources', links: ['Documentation', 'Changelog', 'Blog', 'Status'] },
              { title: 'Company',  links: ['Privacy Policy', 'Terms of Service', 'Contact Us', 'Careers'] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{col.title}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: '#A0958D', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#F4B183'} onMouseLeave={(e) => e.target.style.color = '#A0958D'}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
            <span>© {new Date().getFullYear()} APIForge by Pavithra Borra. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              {['GitHub', 'LinkedIn', 'Twitter'].map(s => <a key={s} href="#" style={{ color: '#A0958D', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>{s}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
