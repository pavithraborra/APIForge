import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from '../context/WorkspaceContext';
import { Card, EmptyState, Button, Spinner } from '../components/ui';
import { HiOutlineLightningBolt, HiOutlineFolderAdd, HiOutlineUserAdd, HiOutlineCube, HiOutlineClock } from 'react-icons/hi';
import workspaceService from '../services/workspaceService';
import activityService from '../services/activityService';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import WelcomeModal from '../components/onboarding/WelcomeModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeWorkspace, workspaces } = useWorkspace();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem(`onboarded_user_${user._id}`)) {
      setIsWelcomeOpen(true);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const res = await workspaceService.getAnalytics(activeWorkspace._id);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    if (!activeWorkspace) return;
    setLoadingActivities(true);
    try {
      const res = await activityService.getActivities(activeWorkspace._id, { limit: 5 });
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to load recent activities', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, [activeWorkspace]);

  const methodColors = {
    GET: '#B8E6D2',
    POST: '#F4B183',
    PUT: '#FFD89C',
    DELETE: '#E65A5A',
    PATCH: '#D8C3F2'
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-text-primary">Welcome back, {user?.username || 'developer'}!</h2>
          <p className="text-sm text-text-secondary">Here is what is happening in your active workspace today.</p>
        </div>
        {activeWorkspace && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-borders shadow-sm">
            <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: activeWorkspace.color }} />
            <span className="font-semibold text-sm text-text-primary">{activeWorkspace.name}</span>
          </div>
        )}
      </div>

      {!activeWorkspace ? (
        <EmptyState
          icon={<HiOutlineCube className="h-16 w-16 text-primary" />}
          title="No Active Workspace"
          description="Create a workspace or set one to active to see your analytics and collections."
          actionLabel="Go to Workspaces"
          onAction={() => navigate('/workspaces')}
        />
      ) : (
        <>
          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-white p-6 h-24" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white flex justify-between items-center border-l-4 border-l-primary hoverable">
                <div>
                  <span className="text-text-muted text-xs block font-semibold">COLLECTIONS</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{stats.collectionsCount}</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <HiOutlineFolderAdd className="h-6 w-6" />
                </div>
              </Card>

              <Card className="bg-white flex justify-between items-center border-l-4 border-l-mint hoverable">
                <div>
                  <span className="text-text-muted text-xs block font-semibold">API REQUESTS</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{stats.requestsCount}</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-mint/10 flex items-center justify-center text-mint shadow-inner">
                  <HiOutlineLightningBolt className="h-6 w-6" />
                </div>
              </Card>

              <Card className="bg-white flex justify-between items-center border-l-4 border-l-accentLavender hoverable">
                <div>
                  <span className="text-text-muted text-xs block font-semibold">TEAM MEMBERS</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{stats.membersCount}</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-accentLavender/10 flex items-center justify-center text-accentLavender shadow-inner">
                  <HiOutlineUserAdd className="h-6 w-6" />
                </div>
              </Card>

              <Card className="bg-white flex justify-between items-center border-l-4 border-l-gold hoverable">
                <div>
                  <span className="text-text-muted text-xs block font-semibold">RECENT ACTIVITIES</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{stats.recentActivityCount}</span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                  <HiOutlineClock className="h-6 w-6" />
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center text-text-muted">Failed to load analytics statistics.</div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Method Distribution Chart */}
            <Card className="lg:col-span-2 bg-white p-6 space-y-4">
              <h3 className="text-lg font-semibold text-text-primary font-poppins">HTTP Method Distribution</h3>
              <div className="h-64">
                {stats?.methodDistribution && stats.methodDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.methodDistribution}>
                      <XAxis dataKey="_id" stroke="#666666" />
                      <YAxis stroke="#666666" />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                      <Bar dataKey="count">
                        {stats.methodDistribution.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={methodColors[entry._id] || '#F4B183'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-sm font-medium">
                    No endpoint method history recorded yet.
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white p-6 space-y-4">
              <h3 className="text-lg font-semibold text-text-primary font-poppins">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/api-builder')} 
                  variant="outline" 
                  className="w-full justify-start gap-2.5 py-3 hover:bg-hover"
                >
                  <HiOutlineLightningBolt className="h-5 w-5 text-primary" />
                  <span>Execute API Request</span>
                </Button>
                <Button 
                  onClick={() => navigate(`/workspaces/${activeWorkspace._id}`)} 
                  variant="outline" 
                  className="w-full justify-start gap-2.5 py-3 hover:bg-hover"
                >
                  <HiOutlineUserAdd className="h-5 w-5 text-primary" />
                  <span>Manage Workspace Team</span>
                </Button>
                <Button 
                  onClick={() => navigate('/workspaces')} 
                  variant="outline" 
                  className="w-full justify-start gap-2.5 py-3 hover:bg-hover"
                >
                  <HiOutlineCube className="h-5 w-5 text-primary" />
                  <span>Switch Workspace</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Activity Timeline Row */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-white p-6 space-y-4">
              <h3 className="text-lg font-semibold text-text-primary font-poppins">Recent Activity Feed</h3>
              {loadingActivities ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-[2px] before:bg-borders">
                  {activities.map((act) => (
                    <div key={act._id} className="flex gap-4 items-start relative z-10">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-primary shadow-sm border border-white">
                        {(act.user?.username || '?').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-primary-bg p-3.5 rounded-xl border border-borders text-sm space-y-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-semibold text-text-primary">{act.user?.username || 'Someone'}</span>
                          <span className="text-xs text-text-muted">{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-text-secondary">
                          Performed <strong className="text-primary font-medium">{act.action.replace(/_/g, ' ')}</strong> on{' '}
                          <span className="font-medium text-text-primary">{act.entityName}</span>
                        </p>
                        {act.details && (
                          <p className="text-xs bg-white/60 p-1.5 rounded border border-borders/40 font-mono text-text-muted mt-2">
                            {act.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted text-sm">
                  No activity actions recorded yet in this workspace.
                </div>
              )}
            </Card>
          </div>
        </>
      )}
      <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
    </div>
  );
};

export default Dashboard;
