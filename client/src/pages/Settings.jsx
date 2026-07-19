import React, { useState, useEffect } from 'react';
import { Card, Button, Select, useToast } from '../components/ui';
import {
  HiOutlineCog as IconCog,
  HiOutlineColorSwatch as IconColor,
  HiOutlineBell as IconBell,
  HiOutlineLockClosed as IconLock,
  HiOutlineCloud as IconCloud,
  HiOutlineExternalLink as IconLink,
  HiOutlineDatabase as IconDb,
  HiOutlineServer as IconServer,
} from 'react-icons/hi';

// ─── Theme Utility ────────────────────────────────────────────────────────────
export const applyTheme = (themeValue) => {
  const root = document.documentElement;
  if (themeValue === 'dark') {
    root.classList.add('theme-dark');
  } else if (themeValue === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.add('theme-dark');
    else root.classList.remove('theme-dark');
  } else {
    root.classList.remove('theme-dark');
  }
};

// ─── Deployment info ──────────────────────────────────────────────────────────
const DEPLOYMENT = {
  frontend: { label: 'Frontend (Vercel)',         url: 'https://api-forge-itut.vercel.app',             status: 'live'      },
  backend:  { label: 'Backend API (Render)',       url: 'https://apiforge-backend-62to.onrender.com',    status: 'live'      },
  database: { label: 'Database (MongoDB Atlas)',   url: null,                                            status: 'connected' },
};

const StatusBadge = ({ status }) => {
  const styles = {
    live:      'bg-green-100 text-green-700',
    connected: 'bg-blue-100 text-blue-700',
    down:      'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.live}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',       label: 'General Preferences', icon: IconCog   },
  { id: 'appearance',    label: 'Appearance',           icon: IconColor },
  { id: 'notifications', label: 'Notifications',        icon: IconBell  },
  { id: 'deployment',    label: 'Deployment',           icon: IconCloud },
  { id: 'security',      label: 'Security Keys',        icon: IconLock  },
];

// ─── Main Settings Page ───────────────────────────────────────────────────────
const Settings = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab]                     = useState('general');
  const [theme, setTheme]                             = useState(() => localStorage.getItem('appTheme') || 'peach');
  const [sidebarLayout, setSidebarLayout]             = useState(() => localStorage.getItem('sidebarLayout') || 'expanded');
  const [notificationsEmail, setNotificationsEmail]   = useState(true);
  const [notificationsSlack, setNotificationsSlack]   = useState(false);
  const [saving, setSaving]                           = useState(false);

  // Apply persisted theme on mount
  useEffect(() => { applyTheme(theme); }, []); // eslint-disable-line

  const handleThemeChange = (e) => {
    const val = e.target.value;
    setTheme(val);
    applyTheme(val); // live preview
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('appTheme', theme);
      localStorage.setItem('sidebarLayout', sidebarLayout);
      applyTheme(theme);
      setSaving(false);
      addToast({ title: 'Settings Saved', message: 'Your preferences have been saved successfully.', type: 'success' });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">Configure app preferences, appearance, notifications, and deployment information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ─── Sidebar navigation ─── */}
        <div className="space-y-1 md:col-span-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`w-full text-left p-3 rounded-xl text-sm flex items-center gap-2 transition-all duration-150 ${
                activeTab === id
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/25'
                  : 'hover:bg-hover text-text-secondary'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* ─── Content panel ─── */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>

            {/* GENERAL */}
            {activeTab === 'general' && (
              <Card className="bg-white p-6 space-y-6">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconCog className="h-5 w-5 text-primary" /> General Preferences
                </h3>
                <div>
                  <Select
                    label="Sidebar Layout"
                    value={sidebarLayout}
                    onChange={(e) => setSidebarLayout(e.target.value)}
                    options={[
                      { value: 'expanded', label: 'Expanded — show text labels' },
                      { value: 'collapsed', label: 'Compact — icon-only' },
                    ]}
                  />
                  <p className="text-xs text-text-muted mt-1">Choose how the left navigation is displayed by default.</p>
                </div>
                <div className="flex justify-end pt-4 border-t border-borders">
                  <Button type="submit" variant="primary" loading={saving}>Save Preferences</Button>
                </div>
              </Card>
            )}

            {/* APPEARANCE */}
            {activeTab === 'appearance' && (
              <Card className="bg-white p-6 space-y-6">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconColor className="h-5 w-5 text-primary" /> Theme &amp; Appearance
                </h3>
                <div>
                  <Select
                    label="Interface Theme"
                    value={theme}
                    onChange={handleThemeChange}
                    options={[
                      { value: 'peach',  label: 'Warm Peach (Default)' },
                      { value: 'dark',   label: 'Dark Mode' },
                      { value: 'system', label: 'Follow System Settings' },
                    ]}
                  />
                  <p className="text-xs text-text-muted mt-1">Changes apply live. Click Save to persist across sessions.</p>
                </div>

                {/* Theme preview chips */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'peach',  label: 'Warm Peach', bg: '#FFF8F3', accent: '#F4B183' },
                    { val: 'dark',   label: 'Dark Mode',  bg: '#1E1B1A', accent: '#E78F81' },
                    { val: 'system', label: 'System',     bg: '#F3F4F6', accent: '#6B7280' },
                  ].map(({ val, label, bg, accent }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleThemeChange({ target: { value: val } })}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        theme === val ? 'border-primary shadow-md' : 'border-borders hover:border-primary/40'
                      }`}
                      style={{ background: bg }}
                    >
                      <div className="h-5 w-full rounded-md mb-2" style={{ background: accent }} />
                      <span className="text-xs font-semibold" style={{ color: accent }}>{label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-borders">
                  <Button type="submit" variant="primary" loading={saving}>Save Theme</Button>
                </div>
              </Card>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <Card className="bg-white p-6 space-y-6">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconBell className="h-5 w-5 text-primary" /> Notification Subscriptions
                </h3>
                <div className="space-y-4">
                  {[
                    { state: notificationsEmail, setter: setNotificationsEmail, title: 'Receive Email Updates', desc: 'Weekly summaries and critical workspace invitations.' },
                    { state: notificationsSlack, setter: setNotificationsSlack, title: 'Direct Slack Integration', desc: 'Post directly to a Slack channel when workspace endpoints are updated.' },
                  ].map(({ state, setter, title, desc }) => (
                    <label key={title} className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={state}
                        onChange={(e) => setter(e.target.checked)}
                        className="mt-0.5 h-4 w-4 text-primary focus:ring-primary border-borders rounded"
                      />
                      <div>
                        <span className="text-sm font-semibold text-text-primary block">{title}</span>
                        <span className="text-xs text-text-muted">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end pt-4 border-t border-borders">
                  <Button type="submit" variant="primary" loading={saving}>Save Preferences</Button>
                </div>
              </Card>
            )}

            {/* DEPLOYMENT */}
            {activeTab === 'deployment' && (
              <Card className="bg-white p-6 space-y-6">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconCloud className="h-5 w-5 text-primary" /> Deployment &amp; Infrastructure
                </h3>
                <p className="text-sm text-text-secondary">
                  Current production deployment targets. These values reflect your environment configuration.
                </p>

                <div className="space-y-3">
                  {/* Frontend */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-borders">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><IconLink className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{DEPLOYMENT.frontend.label}</p>
                        <a href={DEPLOYMENT.frontend.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block truncate max-w-[200px]">
                          {DEPLOYMENT.frontend.url}
                        </a>
                      </div>
                    </div>
                    <StatusBadge status={DEPLOYMENT.frontend.status} />
                  </div>

                  {/* Backend */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-borders">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><IconServer className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{DEPLOYMENT.backend.label}</p>
                        <a href={`${DEPLOYMENT.backend.url}/api`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline block truncate max-w-[200px]">
                          {DEPLOYMENT.backend.url}
                        </a>
                      </div>
                    </div>
                    <StatusBadge status={DEPLOYMENT.backend.status} />
                  </div>

                  {/* Database */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-borders">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg"><IconDb className="h-4 w-4 text-primary" /></div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{DEPLOYMENT.database.label}</p>
                        <p className="text-xs text-text-muted">Connection string stored securely in server env vars</p>
                      </div>
                    </div>
                    <StatusBadge status={DEPLOYMENT.database.status} />
                  </div>
                </div>

                {/* Seed info */}
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-1.5">
                  <p className="text-sm font-semibold text-amber-800">Demo Account Credentials</p>
                  <p className="text-xs text-amber-700">
                    Email:&nbsp;<code className="bg-amber-100 px-1 rounded">sarah.chen@example.com</code>
                  </p>
                  <p className="text-xs text-amber-700">
                    Password:&nbsp;<code className="bg-amber-100 px-1 rounded">password123</code>
                  </p>
                  <p className="text-xs text-amber-600 pt-1 border-t border-amber-200">
                    To seed production Atlas: set <code className="bg-amber-100 px-1 rounded">MONGODB_URI</code> in your
                    server .env, then run <code className="bg-amber-100 px-1 rounded">npm run seed</code> from the server directory.
                    Only demo emails are removed — real users are preserved.
                  </p>
                </div>
              </Card>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <Card className="bg-white p-6 space-y-6">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconLock className="h-5 w-5 text-primary" /> Security &amp; API Keys
                </h3>
                <div className="rounded-xl bg-primary/5 border border-borders p-4 text-sm text-text-secondary">
                  <p className="font-medium text-text-primary mb-1">Personal Access Tokens</p>
                  <p className="text-xs">
                    API key management is coming soon. You will be able to generate tokens for
                    CI/CD pipelines and external integrations here.
                  </p>
                </div>
                <div className="flex justify-end pt-4 border-t border-borders">
                  <Button type="button" variant="outline" disabled>Generate Token (Coming Soon)</Button>
                </div>
              </Card>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
