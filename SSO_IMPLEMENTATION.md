# SSO (Single Sign-On) Implementation Guide

This document describes the SSO integration between the Next.js frontend (app.real-leaders.com) and WordPress backend (real-leaders.com).

## Overview

The SSO implementation ensures users stay logged in across both platforms (frontend and WordPress) and provides seamless authentication synchronization.

## Architecture

### Components Created

1. **src/lib/ssoUtils.ts** - Core SSO utility functions
2. **src/hooks/useSSO.ts** - React hook for SSO management
3. **src/components/SSOProvider.tsx** - Global SSO provider component
4. **Updated components:**
   - `src/components/AuthGuard.tsx` - Integrated SSO check
   - `src/app/login/page.tsx` - Added SSO login flow
   - `src/components/ui/UserProfileDropdown.tsx` - Added SSO logout
   - `src/lib/authUtils.ts` - Added SSO logout sync

## Four SSO Flows

### Flow 1: WordPress to Frontend (SSO Check)

**When:** User visits frontend without a token

**Process:**
1. Frontend checks for `auth_token` in localStorage
2. If not found, redirects to WordPress SSO check endpoint:
   ```
   https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=https://app.real-leaders.com/dashboard
   ```
3. WordPress checks if user has an active session
4. If logged in, WordPress redirects back with token:
   ```
   https://app.real-leaders.com/dashboard?auth_token=XXX&logged_in=true
   ```
5. Frontend stores token and reloads to update user context

**Implementation:**
- Handled automatically by `SSOProvider` component
- Triggered by `AuthGuard` when no token is found

### Flow 2: Frontend to WordPress (Login Sync)

**When:** User logs in on frontend

**Process:**
1. User successfully logs in via password or OTP
2. Frontend receives auth token
3. Frontend redirects to WordPress login endpoint:
   ```
   https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/login-to-wordpress?token=XXX&redirect_url=https://app.real-leaders.com/dashboard
   ```
4. WordPress establishes session using the token
5. WordPress redirects back:
   ```
   https://app.real-leaders.com/dashboard?wp_login=true
   ```
6. User is now logged in on both platforms

**Implementation:**
- Called in `handlePasswordLogin()` and `handleVerifyOTP()` in login page
- Uses `loginToWordPress()` from `ssoUtils.ts`

### Flow 3: Logout Sync

**When:** User logs out from frontend

**Process:**
1. User clicks logout
2. Frontend sends POST request to WordPress:
   ```
   POST https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/sync-logout
   Authorization: Bearer {token}
   ```
3. WordPress expires the token
4. Frontend clears localStorage
5. User is logged out on both platforms

**Implementation:**
- Integrated in `UserProfileDropdown` logout handler
- Also called in `handleUnauthorized()` for 401 errors
- Uses `syncLogoutWithWordPress()` from `ssoUtils.ts`

### Flow 4: Token Refresh

**When:** Automatically every 2 hours while user is active

**Process:**
1. `SSOProvider` starts interval timer on mount
2. Every 2 hours, sends POST request:
   ```
   POST https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/refresh-token
   Authorization: Bearer {current_token}
   ```
3. WordPress returns new token:
   ```json
   {
     "success": true,
     "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "expires_in": 86400
   }
   ```
4. Frontend updates token in localStorage

**Implementation:**
- Handled by `SSOProvider` component
- Uses `startTokenRefreshInterval()` from `ssoUtils.ts`
- Interval cleared on component unmount

## Usage

### For Developers

The SSO implementation is automatic and requires no manual intervention in most cases. However, you can use the hooks and utilities directly if needed:

#### Using the SSO Hook

```typescript
import { useSSO } from '@/hooks/useSSO';

function MyComponent() {
  const { isProcessingSSO, loginWithSSO, logoutWithSSO } = useSSO();

  const handleLogin = async (token: string) => {
    await loginWithSSO(token, '/dashboard');
  };

  const handleLogout = async () => {
    await logoutWithSSO();
  };

  return (
    // Your component JSX
  );
}
```

#### Using SSO Utilities Directly

```typescript
import {
  checkWordPressSession,
  loginToWordPress,
  syncLogoutWithWordPress,
  refreshAuthToken,
  handleSSOCallback,
} from '@/lib/ssoUtils';

// Check WordPress session
checkWordPressSession('/dashboard');

// Login to WordPress after frontend login
loginToWordPress(authToken, '/dashboard');

// Sync logout
await syncLogoutWithWordPress(authToken);

// Refresh token
const result = await refreshAuthToken(currentToken);

// Handle SSO callback
const { authToken, wpLogin, loggedIn } = handleSSOCallback();
```

## Configuration

### Environment Variables

No additional environment variables are required. The SSO endpoints are hardcoded:

- WordPress Base URL: `https://real-leaders.com`
- Frontend Base URL: `https://app.real-leaders.com`

If you need to change these for development/staging, update them in `src/lib/ssoUtils.ts`:

```typescript
const WP_SSO_BASE_URL = 'https://real-leaders.com/wp-json/verified-real-leaders/v1/sso';
const FRONTEND_BASE_URL = 'https://app.real-leaders.com';
```

## Testing

### Manual Testing Checklist

1. **Flow 1 - WordPress to Frontend:**
   - [ ] Log in to WordPress (real-leaders.com)
   - [ ] Visit frontend (app.real-leaders.com) in same browser
   - [ ] Verify automatic login without entering credentials

2. **Flow 2 - Frontend to WordPress:**
   - [ ] Log out from both platforms
   - [ ] Log in via frontend (password or OTP)
   - [ ] Visit WordPress site
   - [ ] Verify you're logged in on WordPress

3. **Flow 3 - Logout Sync:**
   - [ ] Log in on both platforms
   - [ ] Log out from frontend
   - [ ] Visit WordPress site
   - [ ] Verify you're logged out on WordPress

4. **Flow 4 - Token Refresh:**
   - [ ] Log in and stay active for 2+ hours
   - [ ] Check browser console for refresh logs
   - [ ] Verify token is updated in localStorage
   - [ ] Verify no logout occurs

### Debugging

Enable console logging to see SSO flow:

```typescript
// In browser console
localStorage.setItem('debug_sso', 'true');
```

Look for console logs prefixed with `[SSO]` to track the flow.

## Security Considerations

1. **Token Storage:** Tokens are stored in localStorage (not sessionStorage) to persist across tabs
2. **HTTPS Only:** All SSO endpoints use HTTPS
3. **Token Expiration:** Tokens are refreshed every 2 hours to maintain security
4. **Logout Sync:** Ensures tokens are invalidated on both platforms
5. **401 Handling:** Automatic logout and WordPress sync on unauthorized errors

## Troubleshooting

### User Not Auto-Logging In

1. Check if WordPress session is active
2. Verify SSO check endpoint is accessible
3. Check browser console for errors
4. Ensure cookies are enabled

### Token Not Refreshing

1. Check if `SSOProvider` is mounted in root layout
2. Verify refresh endpoint is accessible
3. Check browser console for refresh errors
4. Ensure user has valid token

### Logout Not Syncing

1. Verify sync-logout endpoint is accessible
2. Check if token is being sent in Authorization header
3. Look for errors in browser console
4. Ensure WordPress endpoint is working

## WordPress Backend Requirements

The WordPress backend must implement these endpoints:

1. `GET /wp-json/verified-real-leaders/v1/sso/check-session`
2. `GET /wp-json/verified-real-leaders/v1/sso/login-to-wordpress`
3. `POST /wp-json/verified-real-leaders/v1/sso/sync-logout`
4. `POST /wp-json/verified-real-leaders/v1/sso/refresh-token`

Refer to WordPress backend documentation for implementation details.

## Future Enhancements

1. Add SSO support for mobile apps
2. Implement refresh token rotation
3. Add SSO analytics and monitoring
4. Support for multiple WordPress instances
5. Add SSO session management UI

## Support

For issues or questions about SSO implementation, contact the development team or refer to the WordPress backend documentation.
