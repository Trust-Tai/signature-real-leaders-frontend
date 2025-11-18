'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { images } from '@/assets';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetKey, setResetKey] = useState('');
  const [userLogin, setUserLogin] = useState('');

  useEffect(() => {
    const key = searchParams.get('key');
    const login = searchParams.get('login');
    
    if (!key || !login) {
      toast.error('Invalid reset link');
      router.push('/login');
      return;
    }
    
    setResetKey(key);
    setUserLogin(login);
  }, [searchParams, router]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.resetPassword(userLogin, resetKey, newPassword, confirmPassword);
      
      if (response.success) {
        setResetSuccess(true);
        toast.success(response.message || 'Password reset successfully!');
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white p-4 sm:p-8">
        <div className="w-full max-w-lg text-center">
          <div className="mb-8 inline-block bg-zinc-800 px-4 py-3 rounded-lg">
            <Image
              src={images.realLeaders}
              alt="Real Leaders"
              className="h-8 w-auto"
            />
          </div>

          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Password reset successful!</h1>
          <p className="text-zinc-400 mb-8">
            Your password has been reset successfully. You can now log in with your new password.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="w-full h-12 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 mb-6 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          Back to login
        </button>

        <div className="mb-8 inline-block bg-zinc-800 px-4 py-3 rounded-lg">
          <Image
            src={images.realLeaders}
            alt="Real Leaders"
            className="h-8 w-auto"
          />
        </div>

        <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-zinc-400 mb-8">
          Enter your new password below. Make sure it&apos;s strong and secure.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} />
              <label className="text-sm font-medium">New Password</label>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-12 px-4 pr-12 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} />
              <label className="text-sm font-medium">Confirm Password</label>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-12 px-4 pr-12 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !newPassword || !confirmPassword}
            className="w-full h-12 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
