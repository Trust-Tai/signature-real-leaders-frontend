/**
 * Application Configuration
 * Centralized configuration for URLs and API endpoints
 * Uses environment variables with fallbacks for production
 */

// Frontend Application URL
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.real-leaders.com';

// WordPress Backend URL
export const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://real-leaders.com';

// API Base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || `${WP_URL}/wp-json/verified-real-leaders/v1`;

// Specific API Endpoints
export const API_ENDPOINTS = {
  // Main API
  BASE: API_BASE_URL,
  
  // SSO Endpoints
  SSO: `${API_BASE_URL}/sso`,
  SSO_CHECK_SESSION: `${API_BASE_URL}/sso/check-session`,
  SSO_LOGIN: `${API_BASE_URL}/sso/login-to-wordpress`,
  SSO_LOGOUT: `${API_BASE_URL}/sso/sync-logout`,
  SSO_REFRESH: `${API_BASE_URL}/sso/refresh-token`,
  
  // Magic Publishing
  MAGIC_PUBLISHING: `${API_BASE_URL}/magic-publishing`,
  
  // Newsletter
  NEWSLETTER: `${API_BASE_URL}/newsletter`,
  
  // Statistics
  STATISTICS: `${API_BASE_URL}/statistics`,
  
  // User endpoints
  FOLLOW_USER: `${API_BASE_URL}/follow-user`,
  UNFOLLOW_USER: `${API_BASE_URL}/unfollow-user`,
  CHECK_FOLLOW_STATUS: `${API_BASE_URL}/check-follow-status`,
  CLAIM_PROFILE: `${API_BASE_URL}/claim-profile`,
} as const;

// WordPress URLs for auto-login
export const WORDPRESS_URLS = {
  ABOUT_US: `${WP_URL}/about-us`,
  DASHBOARD: `${WP_URL}/wp-admin`,
  PROFILE: `${WP_URL}/wp-admin/profile.php`,
  POSTS: `${WP_URL}/wp-admin/edit.php`,
  MEDIA: `${WP_URL}/wp-admin/upload.php`,
  USERS: `${WP_URL}/wp-admin/users.php`,
  SETTINGS: `${WP_URL}/wp-admin/options-general.php`,
  WP_ADMIN: `${WP_URL}/wp-admin`,
} as const;

// Helper function to get current app URL (useful for client-side)
export const getAppUrl = (): string => {
  if (typeof window !== 'undefined') {
    // On client side, we can use window.location.origin for dynamic URL
    return window.location.origin;
  }
  return APP_URL;
};

// Helper function to build redirect URLs
export const buildRedirectUrl = (path: string): string => {
  const baseUrl = getAppUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
