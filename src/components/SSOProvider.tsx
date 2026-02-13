"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  startTokenRefreshInterval,
  clearTokenRefreshInterval,
} from '@/lib/ssoUtils';

interface SSOProviderProps {
  children: React.ReactNode;
}

/**
 * SSOProvider handles SSO authentication flows and token refresh
 * Should be placed in the root layout to work across all pages
 */
export const SSOProvider: React.FC<SSOProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasProcessedCallback = useRef(false);

  // Handle SSO callback on mount and route changes
  useEffect(() => {
    // Only process callback once per page load
    if (hasProcessedCallback.current) return;

    const processSSOCallback = () => {
      const authToken = searchParams.get('auth_token');
      const wpLogin = searchParams.get('wp_login');
      const loggedIn = searchParams.get('logged_in');

      // Flow 1: WordPress redirected back with auth token
      if (authToken) {
        console.log('[SSO] Received auth token from WordPress');
        console.log('[SSO] Token:', authToken.substring(0, 20) + '...');
        console.log('[SSO] logged_in parameter:', loggedIn);
        
        // Store token
        localStorage.setItem('auth_token', authToken);
        hasProcessedCallback.current = true;
        
        // Clean URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        
        // Reload to trigger user context update
        console.log('[SSO] Token stored, reloading page...');
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }

      // Flow 2: WordPress redirected back after WP login
      if (wpLogin === 'true') {
        console.log('[SSO] WordPress login successful - user logged in on both platforms');
        hasProcessedCallback.current = true;
        
        // Clean URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    };

    processSSOCallback();
  }, [pathname, searchParams]);

  // Setup token refresh interval
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (token && !refreshIntervalRef.current) {
      console.log('[SSO] Starting token refresh interval (every 23 hours)');
      // Refresh token every 23 hours (1380 minutes)
      refreshIntervalRef.current = startTokenRefreshInterval(1380);
    }

    return () => {
      if (refreshIntervalRef.current) {
        console.log('[SSO] Clearing token refresh interval');
        clearTokenRefreshInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [pathname]);

  return <>{children}</>;
};
