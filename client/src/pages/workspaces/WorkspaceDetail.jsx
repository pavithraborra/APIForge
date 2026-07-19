import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast, Card, Button, Input, Select, Tabs, Spinner, Badge } from '../../components/ui';
import workspaceService from '../../services/workspaceService';
import { HiOutlineUserAdd, HiOutlineCog, HiOutlineChartBar, HiOutlineUsers, HiOutlineFolder, HiOutlineTerminal } from 'react-icons/hi';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { colors } from '../../theme/theme';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeWorkspace, setActiveWorkspace, refreshWorkspaces } = useWorkspace();
  const { addToast } = useToast();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Members tab states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');
  const [inviting, setInviting] = useState(false);

  // Settings tab states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#E78F81');
  const [avatar, setAvatar] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchWorkspaceData = async () => {
    setLoading(true);
    try {
      const res = await workspaceService.getWorkspace(id);
      setWorkspace(res.data);
      setName(res.data.name);
      setDescription(res.data.description || '');
      setColor(res.data.color || '#E78F81');
      setAvatar(res.data.avatar || '');
    } catch (err) {
      addToast({
        title: 'Error loading workspace',
        message: err.response?.data?.message || 'Failed to fetch details.',
        type: 'error'
      });
      navigate('/workspaces');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await workspaceService.getAnalytics(id);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab, id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setInviting(true);
    try {
      await workspaceService.inviteMember(id, { email: inviteEmail, role: inviteRole });
      addToast({
        title: 'User Invited',
        message: `Successfully added ${inviteEmail} as a ${inviteRole}`,
        type: 'success'
      });
      setInviteEmail('');
      await fetchWorkspaceData();
    } catch (err) {
      addToast({
        title: 'Invite Failed',
        message: err.response?.data?.message || 'Failed to invite user',
        type: 'error'
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await workspaceService.updateRole(id, userId, { role: newRole });
      addToast({
        title: 'Role Updated',
        message: 'Member role changed successfully.',
        type: 'success'
      });
      await fetchWorkspaceData();
    } catch (err) {
      addToast({
        title: 'Update Failed',
        message: err.response?.data?.message || 'Failed to update member role.',
        type: 'error'
      });
    }
  };

  const handleRemoveMember = async (userId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) return;

    try {
      await workspaceService.removeMember(id, userId);
      addToast({
        title: 'Member Removed',
        message: `Successfully removed ${memberName}`,
        type: 'success'
      });
      await fetchWorkspaceData();
    } catch (err) {
      addToast({
        title: 'Removal Failed',
        message: err.response?.data?.message || 'Failed to remove member.',
        type: 'error'
      });
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await workspaceService.updateWorkspace(id, { name, description, color, avatar });
      addToast({
        title: 'Settings Saved',
        message: 'Workspace settings updated successfully.',
        type: 'success'
      });
      await fetchWorkspaceData();
      await refreshWorkspaces();
    } catch (err) {
      addToast({
        title: 'Save Failed',
        message: err.response?.data?.message || 'Failed to save settings.',
        type: 'error'
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm(`WARNING: Are you absolutely sure you want to delete "${workspace?.name}"? All collections and history will be permanently deleted.`)) return;

    try {
      await workspaceService.deleteWorkspace(id);
      addToast({
        title: 'Workspace Deleted',
        message: 'Workspace was permanently deleted.',
        type: 'success'
      });
      if (activeWorkspace?._id === id) {
        setActiveWorkspace(null);
      }
      await refreshWorkspaces();
      navigate('/workspaces');
    } catch (err) {
      addToast({
        title: 'Delete Failed',
        message: err.response?.data?.message || 'Failed to delete workspace.',
        type: 'error'
      });
    }
  };

  if (loading || !workspace) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const colorPresets = ['#F4B183', '#F7D6BF', '#D8C3F2', '#B8E6D2', '#FFD89C', '#58C27D', '#E65A5A'];
  const chartColors = ['#F4B183', '#D8C3F2', '#B8E6D2', '#FFD89C', '#E65A5A', '#58C27D'];

  const tabList = [
    { id: 'overview', label: 'Overview', icon: HiOutlineFolder },
    { id: 'members', label: 'Members', icon: HiOutlineUsers },
    { id: 'analytics', label: 'Analytics', icon: HiOutlineChartBar },
    { id: 'settings', label: 'Settings', icon: HiOutlineCog },
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-borders">
        <div className="flex items-center gap-4">
          {workspace.avatar ? (
            <img src={workspace.avatar} alt={workspace.name} className="h-14 w-14 rounded-2xl object-cover border border-borders shadow-sm" />
          ) : (
            <div 
              className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl font-poppins shadow-sm"
              style={{ backgroundColor: workspace.color || '#E78F81' }}
            >
              {workspace.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold font-poppins text-text-primary">{workspace.name}</h2>
            <p className="text-sm text-text-secondary">{workspace.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {activeWorkspace?._id !== workspace._id && (
            <Button variant="outline" onClick={() => setActiveWorkspace(workspace)}>
              Set Active Workspace
            </Button>
          )}
          <Button onClick={() => navigate('/workspaces')} variant="ghost">
            Back to Workspaces
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4 bg-white">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">Workspace Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted block">Owner</span>
                <span className="font-medium text-text-primary">{workspace.owner?.username || 'Unknown'} ({workspace.owner?.email})</span>
              </div>
              <div>
                <span className="text-text-muted block">Created At</span>
                <span className="font-medium text-text-primary">{new Date(workspace.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-text-muted block">Members Count</span>
                <span className="font-medium text-text-primary">{workspace.members?.length || 1}</span>
              </div>
              <div>
                <span className="text-text-muted block">Theme Color</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: workspace.color }} />
                  {workspace.color}
                </span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 bg-white">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/api-builder')} variant="outline" className="w-full flex justify-start items-center gap-2">
                <HiOutlineTerminal className="h-5 w-5 text-primary" /> Open API Builder
              </Button>
              <Button onClick={() => setActiveTab('members')} variant="outline" className="w-full flex justify-start items-center gap-2">
                <HiOutlineUsers className="h-5 w-5 text-primary" /> Manage Team
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Invite form */}
          <Card className="space-y-4 bg-white h-fit">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                label="Email Address"
                placeholder="developer@company.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <Select
                label="Assign Role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                options={[
                  { value: 'Admin', label: 'Admin (Manage details & members)' },
                  { value: 'Developer', label: 'Developer (Read & Write APIs)' },
                  { value: 'Viewer', label: 'Viewer (Read Only)' }
                ]}
              />
              <Button type="submit" loading={inviting} className="w-full flex justify-center gap-2">
                <HiOutlineUserAdd className="h-5 w-5" /> Send Invitation
              </Button>
            </form>
          </Card>

          {/* Members List */}
          <Card className="md:col-span-2 space-y-4 bg-white">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">Workspace Members</h3>
            <div className="divide-y divide-borders">
              {workspace.members && workspace.members.map((member) => {
                const userObj = member.user || {};
                const isOwner = workspace.owner?._id === userObj._id;
                
                return (
                  <div key={userObj._id} className="py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      {userObj.profilePicture ? (
                        <img src={userObj.profilePicture} alt={userObj.username} className="h-10 w-10 rounded-full object-cover border border-borders" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                          {(userObj.username || '?').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-text-primary block">{userObj.username || 'Invited User'}</span>
                        <span className="text-xs text-text-secondary">{userObj.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isOwner ? (
                        <Badge variant="primary">Owner</Badge>
                      ) : (
                        <>
                          <Select
                            value={member.role}
                            onChange={(e) => handleRoleChange(userObj._id, e.target.value)}
                            options={['Admin', 'Developer', 'Viewer']}
                            className="text-xs h-8 py-0.5"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-danger hover:bg-danger/10 text-xs"
                            onClick={() => handleRemoveMember(userObj._id, userObj.username)}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingAnalytics ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : analytics ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white">
                  <span className="text-text-muted text-xs block">Collections</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{analytics.collectionsCount}</span>
                </Card>
                <Card className="bg-white">
                  <span className="text-text-muted text-xs block">API Requests</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{analytics.requestsCount}</span>
                </Card>
                <Card className="bg-white">
                  <span className="text-text-muted text-xs block">Team Members</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{analytics.membersCount}</span>
                </Card>
                <Card className="bg-white">
                  <span className="text-text-muted text-xs block">Recent Actions</span>
                  <span className="text-3xl font-extrabold text-text-primary font-poppins">{analytics.recentActivityCount}</span>
                </Card>
              </div>

              {/* Chart section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary font-poppins">HTTP Method Distribution</h3>
                  <div className="h-64">
                    {analytics.methodDistribution && analytics.methodDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.methodDistribution}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {analytics.methodDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-text-muted text-sm">No request history found</div>
                    )}
                  </div>
                </Card>

                <Card className="bg-white p-6 flex flex-col justify-center items-center text-center">
                  <HiOutlineChartBar className="h-16 w-16 text-primary mb-4" />
                  <h4 className="text-lg font-semibold text-text-primary">More Insights coming soon</h4>
                  <p className="text-sm text-text-secondary max-w-xs mt-1">Detailed response time analytics, error rate logging, and mock latency graphs are currently under building phases.</p>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-text-muted">Failed to load analytics details</div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4 bg-white">
            <h3 className="text-lg font-semibold text-text-primary font-poppins">General Settings</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                label="Workspace Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Workspace Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                label="Avatar URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Theme Color</label>
                <div className="flex gap-2">
                  {colorPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setColor(preset)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${color === preset ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" loading={savingSettings}>
                  Save Workspace Settings
                </Button>
              </div>
            </form>
          </Card>

          <Card className="border border-danger/35 bg-red-50/10 space-y-4">
            <h3 className="text-lg font-semibold text-danger font-poppins">Danger Zone</h3>
            <p className="text-sm text-text-secondary">Deleting this workspace will delete all collection endpoints, request history log, and team memberships permanently.</p>
            <Button onClick={handleDeleteWorkspace} className="bg-danger hover:bg-danger/90 text-white w-full border-none">
              Delete Workspace
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetail;
