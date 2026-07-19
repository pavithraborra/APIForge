import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input, useToast } from '../components/ui';
import { HiOutlineUser, HiOutlineLockClosed } from 'react-icons/hi';
import authService from '../services/authService';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updating, setUpdating] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await authService.updateProfile({ username, email, bio, phone });
      updateProfile(res.data);
      addToast({
        title: 'Profile Updated',
        message: 'Successfully updated your profile details.',
        type: 'success'
      });
    } catch (err) {
      addToast({
        title: 'Update Failed',
        message: err.response?.data?.message || 'Failed to update profile.',
        type: 'error'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Match Error',
        message: 'New passwords do not match.',
        type: 'error'
      });
      return;
    }

    setChangingPass(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      addToast({
        title: 'Password Changed',
        message: 'Your password was successfully updated.',
        type: 'success'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to change password.',
        type: 'error'
      });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-text-primary">Profile</h2>
        <p className="text-sm text-text-secondary">Manage your user profile details and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info panel */}
        <Card className="bg-white p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold font-poppins border-2 border-primary shadow-md">
            {user?.username?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-text-primary text-lg font-poppins">{user?.username}</h3>
            <span className="text-xs uppercase font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/25 mt-1 inline-block">
              {user?.role || 'Developer'}
            </span>
          </div>
          <div className="w-full pt-4 border-t border-borders text-left space-y-2 text-xs">
            <div>
              <span className="text-text-muted font-semibold block">Email Address</span>
              <span className="text-text-primary">{user?.email}</span>
            </div>
            <div>
              <span className="text-text-muted font-semibold block">Last Active</span>
              <span className="text-text-primary">{user?.lastActive ? new Date(user.lastActive).toLocaleString() : 'Just now'}</span>
            </div>
          </div>
        </Card>

        {/* Update Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2">
              <HiOutlineUser className="h-5 w-5 text-primary" />
              General Details
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                />
                <Input
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your role..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={updating}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          <Card className="bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary font-poppins flex items-center gap-2">
              <HiOutlineLockClosed className="h-5 w-5 text-primary" />
              Change Password
            </h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={changingPass}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
