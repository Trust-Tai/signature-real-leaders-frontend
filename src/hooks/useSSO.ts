import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  handleSSOCallback,
  checkWordPressSession,
  loginToWordPress,
  syncLogoutWithWordPress,
  startTokenRefreshInterval,
  clearTokenRefreshInterval,
} from '@/lib/ssoUtils';

interface UseSSOOptions {
  enableAutoRefresh?: boolean;
  refreshIntervalMinutes?: number;
}

export const useSSO = (options: UseSSOOptions = {}) => {
  const {
    enableAutoRefresh = true,
    refreshIntervalMinutes = 1380, // 23 hours default
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const [isProcessingSSO, setIsProcessingSSO] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle SSO callback on mount
  useEffect(() => {
    const processSSOCallback = async () => {
      const { authToken, wpLogin, loggedIn } = handleSSOCallback();

      // Flow 1: WordPress redirected back with auth token
      if (authToken) {
        setIsProcessingSSO(true);
        console.log('[useSSO] Received auth token from WordPress');
        console.log('[useSSO] Token:', authToken.substring(0, 20) + '...');
        console.log('[useSSO] logged_in parameter:', loggedIn);
        
        localStorage.setItem('auth_token', authToken);
        
        // Small delay to ensure token is stored
        setTimeout(() => {
          console.log('[useSSO] Reloading to update user context...');
          window.location.reload();
        }, 100);
        return;
      }

      // Flow 2: WordPress redirected back after WP login
      if (wpLogin) {
        console.log('[useSSO] WordPress login successful - user logged in on both platforms');
        setIsProcessingSSO(false);
        return;
      }

      // Check if user needs SSO check
      const token = localStorage.getItem('auth_token');
      const isProtectedRoute = pathname.startsWith('/dashboard');
      
      if (!token && isProtectedRoute && !isProcessingSSO) {
        // No token and accessing protected route - check WordPress session
        console.log('[useSSO] No token found, checking WordPress session...');
        setIsProcessingSSO(true);
        checkWordPressSession(pathname);
      }
    };

    processSSOCallback();
  }, [pathname, isProcessingSSO]);

  // Setup token refresh interval
  useEffect(() => {
    if (enableAutoRefresh) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        refreshIntervalRef.current = startTokenRefreshInterval(refreshIntervalMinutes);
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearTokenRefreshInterval(refreshIntervalRef.current);
      }
    };
  }, [enableAutoRefresh, refreshIntervalMinutes]);

  /**
   * Login and sync with WordPress
   */
  const loginWithSSO = async (authToken: string, redirectPath: string = '/dashboard') => {
    localStorage.setItem('auth_token', authToken);
    
    // Redirect to WordPress to establish session
    loginToWordPress(authToken, redirectPath);
  };

  /**
   * Logout and sync with WordPress
   */
  const logoutWithSSO = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Sync logout with WordPress
      await syncLogoutWithWordPress(token);
    }

    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user_settings');
    localStorage.removeItem('user_preferences');

    // Clear token refresh interval
    if (refreshIntervalRef.current) {
      clearTokenRefreshInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Redirect to login
    router.push('/login');
  };

  return {
    isProcessingSSO,
    loginWithSSO,
    logoutWithSSO,
  };
};
