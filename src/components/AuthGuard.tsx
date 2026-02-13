"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components';


interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingSSO, setIsCheckingSSO] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if we're receiving SSO callback
      const authToken = searchParams.get('auth_token');
      const wpLogin = searchParams.get('wp_login');
      
      // If SSO callback is in progress, wait for SSOProvider to process it
      if (authToken || wpLogin) {
        console.log('[AuthGuard] SSO callback detected, waiting for processing...');
        setIsCheckingSSO(true);
        setIsAuthenticated(null);
        return;
      }
      
      setIsCheckingSSO(false);
      const token = localStorage.getItem('auth_token');
      const userDataStr = localStorage.getItem('user_data');
      
      // If no token and trying to access dashboard routes
      if (!token && pathname.startsWith('/dashboard')) {
        console.log('[AuthGuard] No token found, checking WordPress session...');
        // Redirect to WordPress SSO check
        const redirectUrl = `https://app.real-leaders.com${pathname}`;
        const ssoCheckUrl = `https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=${encodeURIComponent(redirectUrl)}`;
        window.location.href = ssoCheckUrl;
        setIsAuthenticated(false);
        return;
      }
      
      // Check if user account is pending review
      if (token && userDataStr && pathname.startsWith('/dashboard')) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.account_status === 'pending_review') {
            localStorage.setItem('redirect_to_step', '2');
            router.replace('/profile-verification');
            setIsAuthenticated(false);
            return;
          }
        } catch {
          // Silently handle parsing errors
        }
      }
      
      // If token exists or not accessing protected routes, allow access
      setIsAuthenticated(!!token || !pathname.startsWith('/dashboard'));
    };

    // Check immediately without delay
    checkAuth();
  }, [pathname, router, searchParams]);

  // Show loading while checking SSO
  if (isCheckingSSO) {
    return <LoadingScreen text1="Processing authentication..." text2="Please wait" />;
  }

  // If not authenticated and trying to access dashboard, don't render anything
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return <LoadingScreen text1="Checking authentication..." text2="Redirecting..." />;
  }

  // Show loading while checking authentication for non-dashboard routes
  if (isAuthenticated === null && !pathname.startsWith('/dashboard')) {
    return <LoadingScreen text1="Checking authentication..." text2="Please wait" />;
  }

  return <>{children}</>;
};

export default AuthGuard;