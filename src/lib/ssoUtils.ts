// SSO (Single Sign-On) utilities for WordPress integration
// Handles authentication synchronization between frontend and WordPress

const WP_SSO_BASE_URL = 'https://real-leaders.com/wp-json/verified-real-leaders/v1/sso';
const FRONTEND_BASE_URL = 'https://app.real-leaders.com';

/**
 * Flow 1: Check WordPress session and redirect for SSO
 * Called when user visits frontend without a token
 */
export const checkWordPressSession = (currentPath: string = '/dashboard') => {
  const redirectUrl = `${FRONTEND_BASE_URL}${currentPath}`;
  const ssoCheckUrl = `${WP_SSO_BASE_URL}/check-session?redirect_url=${encodeURIComponent(redirectUrl)}`;
  
  // Redirect to WordPress to check session
  window.location.href = ssoCheckUrl;
};

/**
 * Flow 2: Login to WordPress after frontend login
 * Called after successful frontend authentication
 */
export const loginToWordPress = (authToken: string, redirectUrl: string = '/dashboard') => {
  const fullRedirectUrl = `${FRONTEND_BASE_URL}${redirectUrl}`;
  const wpLoginUrl = `${WP_SSO_BASE_URL}/login-to-wordpress?token=${encodeURIComponent(authToken)}&redirect_url=${encodeURIComponent(fullRedirectUrl)}`;
  
  // Redirect to WordPress to establish session
  window.location.href = wpLoginUrl;
};

/**
 * Flow 3: Sync logout with WordPress
 * Called when user logs out from frontend
 */
export const syncLogoutWithWordPress = async (authToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${WP_SSO_BASE_URL}/sync-logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to sync logout with WordPress:', error);
    return false;
  }
};

/**
 * Flow 4: Refresh authentication token
 * Called periodically to keep user session active
 */
export const refreshAuthToken = async (currentToken: string): Promise<{ success: boolean; token?: string; expires_in?: number }> => {
  try {
    console.log('[SSO] Refreshing auth token...');
    console.log('[SSO] Current token (first 20 chars):', currentToken?.substring(0, 20) + '...');
    console.log('[SSO] Token length:', currentToken?.length);
    
    const response = await fetch(`${WP_SSO_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[SSO] Refresh token response status:', response.status);
    
    if (!response.ok) {
      console.error('[SSO] Refresh token failed with status:', response.status);
      const errorText = await response.text();
      console.error('[SSO] Error response:', errorText);
      return { success: false };
    }

    const data = await response.json();
    console.log('[SSO] Refresh token response:', data);
    
    if (data.success && data.token) {
      // Update token in localStorage
      localStorage.setItem('auth_token', data.token);
      console.log('[SSO] Token refreshed successfully');
      return {
        success: true,
        token: data.token,
        expires_in: data.expires_in,
      };
    }
    
    console.warn('[SSO] Refresh token response missing success or token');
    return { success: false };
  } catch (error) {
    console.error('[SSO] Failed to refresh token:', error);
    return { success: false };
  }
};

/**
 * Handle SSO callback from WordPress
 * Processes auth_token and wp_login parameters from URL
 */
export const handleSSOCallback = (): { authToken?: string; wpLogin?: boolean; loggedIn?: boolean } => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('auth_token');
  const loggedIn = urlParams.get('logged_in') === 'true';
  const wpLogin = urlParams.get('wp_login') === 'true';
  
  // Clean up URL parameters
  if (authToken || wpLogin) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }
  
  return {
    authToken: authToken || undefined,
    wpLogin,
    loggedIn,
  };
};

/**
 * Start automatic token refresh interval
 * Refreshes token every 23 hours (1380 minutes)
 */
export const startTokenRefreshInterval = (intervalMinutes: number = 1380): NodeJS.Timeout => {
  const intervalMs = intervalMinutes * 60 * 1000; // 23 hours = 1380 minutes
  
  console.log(`[SSO] Starting token refresh interval: ${intervalMinutes} minutes (${intervalMs}ms) = ${intervalMinutes/60} hours`);
  
  return setInterval(async () => {
    console.log('[SSO] Token refresh interval triggered');
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.warn('[SSO] No token found in localStorage, skipping refresh');
      return;
    }
    
    console.log('[SSO] Token found, attempting refresh...');
    const result = await refreshAuthToken(token);
    
    if (!result.success) {
      console.error('[SSO] Token refresh failed - user may need to re-login');
    } else {
      console.log('[SSO] Token refresh successful');
    }
  }, intervalMs);
};


/**
 * Clear token refresh interval
 */
export const clearTokenRefreshInterval = (intervalId: NodeJS.Timeout) => {
  clearInterval(intervalId);
};
