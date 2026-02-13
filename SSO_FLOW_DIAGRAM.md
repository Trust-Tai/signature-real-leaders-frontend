# SSO Flow Diagrams

## Flow 1: WordPress to Frontend (Auto Login)

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│             │                    │             │                    │             │
│    User     │                    │  WordPress  │                    │  Frontend   │
│             │                    │             │                    │             │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  1. Login to WordPress           │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │  2. Session established          │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │  3. Visit app.real-leaders.com   │                                  │
       │──────────────────────────────────────────────────────────────────>│
       │                                  │                                  │
       │                                  │  4. No token found, check WP     │
       │                                  │<─────────────────────────────────│
       │                                  │                                  │
       │                                  │  5. User has WP session          │
       │                                  │  Generate token                  │
       │                                  │                                  │
       │  6. Redirect with token          │                                  │
       │  ?auth_token=XXX&logged_in=true  │                                  │
       │<─────────────────────────────────────────────────────────────────────│
       │                                  │                                  │
       │  7. Store token & reload         │                                  │
       │──────────────────────────────────────────────────────────────────>│
       │                                  │                                  │
       │  8. User logged in!              │                                  │
       │<─────────────────────────────────────────────────────────────────────│
       │                                  │                                  │
```

## Flow 2: Frontend to WordPress (Login Sync)

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│             │                    │  Frontend   │                    │  WordPress  │
│    User     │                    │             │                    │             │
│             │                    │             │                    │             │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  1. Login (password/OTP)         │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │  2. Verify credentials           │                                  │
       │  Return auth_token               │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │                                  │  3. Store token                  │
       │                                  │  Redirect to WP login            │
       │                                  │─────────────────────────────────>│
       │                                  │                                  │
       │                                  │  4. Establish WP session         │
       │                                  │  using token                     │
       │                                  │                                  │
       │  5. Redirect back                │                                  │
       │  ?wp_login=true                  │                                  │
       │<─────────────────────────────────────────────────────────────────────│
       │                                  │                                  │
       │  6. Logged in on both platforms! │                                  │
       │                                  │                                  │
```

## Flow 3: Logout Sync

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│             │                    │  Frontend   │                    │  WordPress  │
│    User     │                    │             │                    │             │
│             │                    │             │                    │             │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  1. Click logout                 │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │                                  │  2. POST /sso/sync-logout        │
       │                                  │  Authorization: Bearer token     │
       │                                  │─────────────────────────────────>│
       │                                  │                                  │
       │                                  │  3. Expire token                 │
       │                                  │  End WP session                  │
       │                                  │                                  │
       │                                  │  4. Success response             │
       │                                  │<─────────────────────────────────│
       │                                  │                                  │
       │  5. Clear localStorage           │                                  │
       │  Redirect to login               │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │  6. Logged out from both!        │                                  │
       │                                  │                                  │
```

## Flow 4: Token Refresh (Automatic)

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│             │                    │  Frontend   │                    │  WordPress  │
│    User     │                    │  (Timer)    │                    │             │
│             │                    │             │                    │             │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  User is active                  │                                  │
       │  (browsing dashboard)            │                                  │
       │                                  │                                  │
       │                                  │  Every 2 hours...                │
       │                                  │                                  │
       │                                  │  POST /sso/refresh-token         │
       │                                  │  Authorization: Bearer old_token │
       │                                  │─────────────────────────────────>│
       │                                  │                                  │
       │                                  │  Validate old token              │
       │                                  │  Generate new token              │
       │                                  │  Invalidate old token            │
       │                                  │                                  │
       │                                  │  Return new token                │
       │                                  │<─────────────────────────────────│
       │                                  │                                  │
       │                                  │  Update localStorage             │
       │                                  │  with new token                  │
       │                                  │                                  │
       │  User stays logged in!           │                                  │
       │  (seamless, no interruption)     │                                  │
       │                                  │                                  │
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Root Layout                              │
│  (src/app/layout.tsx)                                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              SSOProvider                                │    │
│  │  (src/components/SSOProvider.tsx)                      │    │
│  │                                                          │    │
│  │  • Handles SSO callbacks                               │    │
│  │  • Starts token refresh interval                       │    │
│  │  • Runs on every page                                  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │           AuthGuard                               │  │    │
│  │  │  (src/components/AuthGuard.tsx)                  │  │    │
│  │  │                                                    │  │    │
│  │  │  • Checks authentication                         │  │    │
│  │  │  • Triggers SSO check if no token               │  │    │
│  │  │  • Protects dashboard routes                    │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌────────────────────────────────────────────┐  │  │    │
│  │  │  │         Page Content                        │  │  │    │
│  │  │  │                                              │  │  │    │
│  │  │  │  Login Page:                                │  │  │    │
│  │  │  │  • Calls loginToWordPress() after login    │  │  │    │
│  │  │  │                                              │  │  │    │
│  │  │  │  Dashboard:                                 │  │  │    │
│  │  │  │  • UserProfileDropdown                      │  │  │    │
│  │  │  │  • Calls syncLogoutWithWordPress()         │  │  │    │
│  │  │  │                                              │  │  │    │
│  │  │  └────────────────────────────────────────────┘  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      localStorage                                 │
│                                                                   │
│  • auth_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."                      │
│  • user_data: { id, email, username, ... }                       │
│  • user_id: "123"                                                │
│                                                                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Read/Write
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│   SSOProvider   │            │   Components    │
│                 │            │                 │
│ • Token refresh │            │ • Login         │
│ • SSO callback  │            │ • Logout        │
│                 │            │ • AuthGuard     │
└────────┬────────┘            └────────┬────────┘
         │                              │
         │ API Calls                    │ API Calls
         │                              │
         ▼                              ▼
┌──────────────────────────────────────────────────┐
│           WordPress SSO Endpoints                 │
│                                                   │
│  • /sso/check-session                            │
│  • /sso/login-to-wordpress                       │
│  • /sso/sync-logout                              │
│  • /sso/refresh-token                            │
│                                                   │
└──────────────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Measures                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   HTTPS      │    │   Token      │    │   Logout     │
│   Only       │    │   Refresh    │    │   Sync       │
│              │    │              │    │              │
│ All SSO      │    │ Every 2hrs   │    │ Invalidate   │
│ endpoints    │    │ New token    │    │ on both      │
│ use HTTPS    │    │ Old expired  │    │ platforms    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   401 Handler    │
                    │                  │
                    │ Auto logout      │
                    │ Clear tokens     │
                    │ Sync with WP     │
                    └──────────────────┘
```

## State Management

```
User State Flow:

Not Logged In
     │
     │ Flow 1: Visit from WP
     │ Flow 2: Login on Frontend
     │
     ▼
Logged In (Frontend + WordPress)
     │
     │ Flow 4: Token Refresh (every 2hrs)
     │ ────────────────────────────────────┐
     │                                     │
     │                                     ▼
     │                            Token Updated
     │                                     │
     │◄────────────────────────────────────┘
     │
     │ Flow 3: Logout
     │
     ▼
Logged Out (Frontend + WordPress)
```
