import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Card, Spinner, EmptyState } from '../components/ui';
import { HiOutlineClock, HiOutlineCube, HiOutlineUser, HiOutlineTerminal } from 'react-icons/hi';
import activityService from '../services/activityService';

const Activity = () => {
  const { activeWorkspace } = useWorkspace();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!activeWorkspace) return;
    setLoading(true);
    try {
      const res = await activityService.getActivities(activeWorkspace._id);
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [activeWorkspace]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-text-primary">Activity Log</h2>
        <p className="text-sm text-text-secondary">Audit trail of all actions performed in this workspace.</p>
      </div>

      {!activeWorkspace ? (
        <Card className="bg-white p-8">
          <EmptyState
            icon={<HiOutlineCube className="h-16 w-16 text-primary" />}
            title="No Active Workspace"
            description="Select a workspace to view its activity logs."
          />
        </Card>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : activities.length === 0 ? (
        <Card className="bg-white p-8">
          <EmptyState
            icon={<HiOutlineClock className="h-16 w-16 text-primary" />}
            title="No Activity Registered"
            description="Actions in this workspace will be recorded and displayed here."
          />
        </Card>
      ) : (
        <Card className="bg-white p-6">
          <div className="relative border-l-2 border-borders pl-6 ml-4 space-y-8">
            {activities.map((activity, index) => {
              const iconMap = {
                user: HiOutlineUser,
                workspace: HiOutlineCube,
                collection: HiOutlineClock,
                request: HiOutlineTerminal
              };
              const ActivityIcon = iconMap[activity.entityType?.toLowerCase()] || HiOutlineClock;

              return (
                <div key={activity._id} className="relative">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[35px] top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-primary text-primary shadow-sm">
                    <ActivityIcon className="w-3.5 h-3.5" />
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="font-semibold text-text-primary text-sm font-poppins">
                        {activity.user?.username || 'System'}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-medium text-text-primary uppercase tracking-wider text-[10px] bg-primary-bg px-2 py-0.5 rounded border border-borders mr-2">
                        {activity.action}
                      </span>
                      {activity.details || `Performed action on ${activity.entityType || 'entity'}`}
                      {activity.entityName && (
                        <span className="font-semibold text-text-primary font-mono ml-1">
                          "{activity.entityName}"
                        </span>
                      )}
                    </p>

                    {activity.ipAddress && (
                      <span className="block text-[9px] text-text-muted font-mono mt-1">
                        IP: {activity.ipAddress}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Activity;
