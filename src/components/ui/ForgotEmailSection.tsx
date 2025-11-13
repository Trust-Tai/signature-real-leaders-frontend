'use client'
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Mail } from 'lucide-react';
import { images } from '@/assets';

interface ForgotEmailSectionProps {
  onBack: () => void;
}

const ForgotEmailSection: React.FC<ForgotEmailSectionProps> = ({ onBack }) => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call for email recovery
    setTimeout(() => {
      setIsSubmitting(false);
      // You can add actual API call here
      alert('If this email exists in our system, you will receive recovery instructions.');
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Back Button - Top left */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to login</span>
        </button>
      </div>

      {/* Logo - Centered */}
      <div className="text-center mb-8">
        <div className="inline-block bg-zinc-800 px-4 py-3 rounded-lg">
          <Image
            src={images.realLeaders}
            alt="Real Leaders"
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Header - Centered */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Forgot your email?</h1>
        <p className="text-zinc-400 text-sm">
          Enter your recovery email to reset your password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 mb-2 text-white text-sm">
            <Mail size={16} />
            Recovery Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recovery@example.com"
            className="w-full h-12 px-4 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
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
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotEmailSection;