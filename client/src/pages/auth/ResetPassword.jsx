import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast, Button, Input, Card } from '../../components/ui';
import { HiOutlineLockClosed } from 'react-icons/hi';
import Logo from '../../assets/Logo';
import api from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({
        title: 'Validation Error',
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      addToast({
        title: 'Success',
        message: 'Password has been reset successfully. Please log in with your new password.',
        type: 'success'
      });
      navigate('/login');
    } catch (err) {
      addToast({
        title: 'Reset Failed',
        message: err.response?.data?.message || 'Invalid or expired reset token.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary tracking-tight font-poppins">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-xl sm:px-10 border-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={HiOutlineLockClosed}
              placeholder="••••••••"
              minLength={6}
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={HiOutlineLockClosed}
              placeholder="••••••••"
              minLength={6}
            />

            <Button
              type="submit"
              className="w-full shadow-md"
              loading={loading}
              size="lg"
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-medium text-primary hover:text-[#D47E70] transition-colors">
              Back to Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
