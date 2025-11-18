'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { images } from '@/assets';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.forgotPassword(email);
      
      if (response.success) {
        setEmailSent(true);
        toast.success(response.message || 'Password reset email sent successfully!');
      } else {
        toast.error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
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

          <h1 className="text-3xl font-bold mb-4">Check your email</h1>
          <p className="text-zinc-400 mb-8">
            We&apos;ve sent a password reset link to <span className="text-white font-medium">{email}</span>
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full h-12 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition"
            >
              Back to Login
            </button>
            
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full h-12 rounded-full border border-zinc-600 text-white hover:bg-zinc-800 transition"
            >
              Try another email
            </button>
          </div>
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

        <h1 className="text-3xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-zinc-400 mb-8">
          No worries! Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} />
              <label className="text-sm font-medium">Email Address</label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@realleaders.com"
              className="w-full h-12 px-4 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full h-12 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
