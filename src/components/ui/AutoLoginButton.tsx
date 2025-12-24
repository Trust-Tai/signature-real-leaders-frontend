"use client";

import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useAutoLogin } from '@/hooks/useAutoLogin';
import Button from './Button';

interface AutoLoginButtonProps {
  redirectUrl?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

const AutoLoginButton: React.FC<AutoLoginButtonProps> = ({
  redirectUrl = 'https://real-leaders.com/about-us',
  children = 'Go to WordPress',
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const { isLoading, error, autoLogin, clearError } = useAutoLogin();

  const handleClick = async () => {
    // Clear any previous errors
    if (error) {
      clearError();
    }
    
    // Trigger auto-login
    await autoLogin(redirectUrl);
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        variant={variant}
        size={size}
        className={`flex items-center space-x-2 ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </Button>
      
      {/* Error display */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default AutoLoginButton;