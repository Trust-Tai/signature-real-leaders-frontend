"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onLinkedInLogin?: () => void;
  className?: string;
  isLoading?: boolean;
  variant?: 'default' | 'login'; // login variant for different Apple button styling
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onAppleLogin,
  onLinkedInLogin,
  className,
  isLoading = false,
  variant = 'default'
}) => {
  const [loadingButton, setLoadingButton] = useState<'google' | 'apple' | 'linkedin' | null>(null);

  const handleGoogleClick = () => {
    setLoadingButton('google');
    onGoogleLogin?.();
  };

  const handleAppleClick = () => {
    // setLoadingButton('apple');
    onAppleLogin?.();
  };

  const handleLinkedInClick = () => {
    setLoadingButton('linkedin');
    onLinkedInLogin?.();
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
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
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Google Login */}
      <button
        onClick={handleGoogleClick}
        disabled={isLoading || loadingButton !== null}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingButton === 'google' ? (
          <LoadingSpinner />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        <span className="font-outfit font-medium text-gray-700">
          {loadingButton === 'google' ? 'Redirecting...' : 'Continue with Google'}
        </span>
      </button>

     

      {/* LinkedIn Login */}
      <button
        onClick={handleLinkedInClick}
        disabled={isLoading || loadingButton !== null}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingButton === 'linkedin' ? (
          <LoadingSpinner />
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )}
        <span className="font-outfit font-medium">
          {loadingButton === 'linkedin' ? 'Redirecting...' : 'Continue with LinkedIn'}
        </span>
      </button>

       {/* Apple Login */}
      <button
        onClick={handleAppleClick}
        disabled={isLoading || loadingButton !== null}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed",
          variant === 'login' 
            ? "bg-white border-2 border-gray-400 text-black hover:bg-gray-100 shadow-md" 
            : "bg-black text-white hover:bg-gray-800"
        )}
      >
        {loadingButton === 'apple' ? (
          <LoadingSpinner />
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        )}
        <span className="font-outfit font-medium">
          {loadingButton === 'apple' ? 'Redirecting...' : 'Continue with Apple'}
        </span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;