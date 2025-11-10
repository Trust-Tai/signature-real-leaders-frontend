"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SocialLoginButtons from './SocialLoginButtons';

interface SimplifiedEmailVerificationSectionProps {
  onSendCode: (email: string) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onLinkedInLogin?: () => void;
  className?: string;
  error?: string;
  isLoading?: boolean;
}

const SimplifiedEmailVerificationSection: React.FC<SimplifiedEmailVerificationSectionProps> = ({
  onSendCode,
  onGoogleLogin,
  onAppleLogin,
  onLinkedInLogin,
  className,
  error,
  isLoading = false
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !isValidEmail) {
      console.log('Invalid email:', email);
      return;
    }
    
    console.log('Sending email to parent:', email);
    onSendCode(email);
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        CREATE YOUR ACCOUNT
      </h2>

      {/* Social Login Options */}
      <div className="space-y-6">
         {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='firstVerifyScreen mx-auto group'>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              placeholder="Enter your email address..."
              required
              disabled={!!isLoading}
              aria-busy={!!isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValidEmail || !!isLoading}
            className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
          >
            {isLoading ? (
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
                SENDING...
              </>
            ) : (
              'SEND VERIFICATION CODE'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-outfit text-sm">or continue with Social Login</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

       

        <SocialLoginButtons
          onGoogleLogin={onGoogleLogin}
          onAppleLogin={onAppleLogin}
          onLinkedInLogin={onLinkedInLogin}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SimplifiedEmailVerificationSection;