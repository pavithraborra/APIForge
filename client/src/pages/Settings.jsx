import React, { useState } from 'react';
import { Card, Button, Input, Select, useToast } from '../components/ui';
import { HiOutlineCog as IconCog, HiOutlineColorSwatch as IconColor, HiOutlineBell as IconBell, HiOutlineLockClosed as IconLock } from 'react-icons/hi';

const Settings = () => {
  const { addToast } = useToast();
  const [theme, setTheme] = useState('peach');
  const [sidebarLayout, setSidebarLayout] = useState('expanded');
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSlack, setNotificationsSlack] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({
        title: 'Settings Saved',
        message: 'Your system and notification preferences have been saved successfully.',
        type: 'success'
      });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">Configure app preferences, layout choices, and system behaviors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-1">
          <button className="w-full text-left p-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm flex items-center gap-2 border border-primary/25">
            <IconCog className="h-4 w-4" />
            General Preferences
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-hover text-text-secondary text-sm flex items-center gap-2 transition-colors">
            <IconColor className="h-4 w-4" />
            Appearance
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-hover text-text-secondary text-sm flex items-center gap-2 transition-colors">
            <IconBell className="h-4 w-4" />
            Notification Rules
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-hover text-text-secondary text-sm flex items-center gap-2 transition-colors">
            <IconLock className="h-4 w-4" />
            Security Keys
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <Card className="bg-white p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconColor className="h-5 w-5 text-primary" />
                  Theme & Layout Options
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Interface Theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    options={[
                      { value: 'peach', label: 'Warm Peach (Enterprise Premium)' },
                      { value: 'system', label: 'Follow System Settings' }
                    ]}
                  />
                  
                  <Select
                    label="Sidebar Layout"
                    value={sidebarLayout}
                    onChange={(e) => setSidebarLayout(e.target.value)}
                    options={[
                      { value: 'expanded', label: 'Expanded text labels' },
                      { value: 'collapsed', label: 'Compact icon-only' }
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2 pb-2 border-b border-borders">
                  <IconBell className="h-5 w-5 text-primary" />
                  Notification Subscriptions
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationsEmail}
                      onChange={(e) => setNotificationsEmail(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-borders rounded"
                    />
                    <div>
                      <span className="text-sm font-semibold text-text-primary block">Receive Email Updates</span>
                      <span className="text-xs text-text-muted">Weekly summaries and critical workspace invitations.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationsSlack}
                      onChange={(e) => setNotificationsSlack(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-borders rounded"
                    />
                    <div>
                      <span className="text-sm font-semibold text-text-primary block">Direct Slack Integrations</span>
                      <span className="text-xs text-text-muted">Post directly to slack channel when workspace endpoints are updated.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-borders">
                <Button type="submit" variant="primary" loading={saving}>
                  Save Preferences
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
