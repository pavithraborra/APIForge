import React, { useState, useEffect } from 'react';
import { Card, Button, EmptyState, Spinner, Badge } from '../components/ui';
import { HiOutlineBell, HiOutlineCheckCircle, HiOutlineTrash, HiOutlineMailOpen } from 'react-icons/hi';
import notificationService from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data || []);
      // getNotifications already returns unreadCount embedded in response
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const target = notifications.find(n => n._id === id);
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (target && !target.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-text-primary flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="primary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </h2>
          <p className="text-sm text-text-secondary">Keep track of invitations, changes, and workspace activity.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <HiOutlineCheckCircle className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="bg-white p-8">
          <EmptyState
            icon={<HiOutlineBell className="h-16 w-16 text-primary" />}
            title="Clean Slate"
            description="You don't have any notifications right now."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <Card 
              key={notif._id} 
              className={`p-4 bg-white border transition-all duration-200 ${
                notif.isRead ? 'border-borders opacity-80' : 'border-primary/30 shadow-md shadow-primary/5 bg-gradient-to-r from-primary/5 to-transparent'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    notif.isRead ? 'bg-primary-bg text-text-muted' : 'bg-primary/20 text-primary font-bold'
                  }`}>
                    <HiOutlineBell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm font-poppins">{notif.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{notif.message}</p>
                    <span className="text-[10px] text-text-muted mt-2 block">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notif.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="p-1 hover:bg-hover text-text-muted hover:text-primary"
                      title="Mark as read"
                    >
                      <HiOutlineMailOpen className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(notif._id)}
                    className="p-1 hover:bg-danger/10 text-text-muted hover:text-danger"
                    title="Delete notification"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
