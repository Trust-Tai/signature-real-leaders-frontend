import { api } from './api';
import { toast } from '@/components/ui/toast';

/**
 * Common WordPress URLs for auto-login
 */
export const WORDPRESS_URLS = {
  ABOUT_US: 'https://verified.real-leaders.com/about-us',
  DASHBOARD: 'https://verified.real-leaders.com/wp-admin',
  PROFILE: 'https://verified.real-leaders.com/wp-admin/profile.php',
  POSTS: 'https://verified.real-leaders.com/wp-admin/edit.php',
  MEDIA: 'https://verified.real-leaders.com/wp-admin/upload.php',
  USERS: 'https://verified.real-leaders.com/wp-admin/users.php',
  SETTINGS: 'https://verified.real-leaders.com/wp-admin/options-general.php',
} as const;

/**
 * Auto-login utility function
 * @param redirectUrl - Optional URL to redirect to after login
 * @param openInNewTab - Whether to open in new tab (default: true)
 * @returns Promise<boolean> - Success status
 */
export const performAutoLogin = async (
  redirectUrl?: string, 
  openInNewTab: boolean = true
): Promise<boolean> => {
  try {
    // Get auth token
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      toast.error('Please log in first to access WordPress');
      return false;
    }

    console.log('[AutoLogin Utility] Starting auto-login...', { redirectUrl, openInNewTab });
    
  

    // Call auto-login API
    const response = await api.autoLogin(authToken, redirectUrl);

    if (response.success) {
      console.log('[AutoLogin Utility] Success:', response);


      // Handle redirect
      const targetUrl = response.login_url || response.redirect_url || redirectUrl;
      if (targetUrl) {
        if (openInNewTab) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = targetUrl;
        }
      }

      return true;
    } else {
      const errorMessage = response.message || 'Auto-login failed';
      console.error('[AutoLogin Utility] Failed:', errorMessage);
      toast.error(`Connection failed: ${errorMessage}`);
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[AutoLogin Utility] Error:', error);
    toast.error(`Connection error: ${errorMessage}`);
    return false;
  }
};

/**
 * Quick access functions for common WordPress areas
 */
export const autoLoginTo = {
  aboutUs: () => performAutoLogin(WORDPRESS_URLS.ABOUT_US),
  dashboard: () => performAutoLogin(WORDPRESS_URLS.DASHBOARD),
  profile: () => performAutoLogin(WORDPRESS_URLS.PROFILE),
  posts: () => performAutoLogin(WORDPRESS_URLS.POSTS),
  media: () => performAutoLogin(WORDPRESS_URLS.MEDIA),
  users: () => performAutoLogin(WORDPRESS_URLS.USERS),
  settings: () => performAutoLogin(WORDPRESS_URLS.SETTINGS),
};