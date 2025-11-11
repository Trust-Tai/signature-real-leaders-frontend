# Pending Review Redirect Implementation

## Overview
Users with `account_status: "pending_review"` are now redirected to the `/profile-verification` page instead of showing a notification and staying on the login page.

## Changes Made

### 1. Dashboard Page (`src/app/dashboard/page.tsx`)
**Before**: Showed toast notification and redirected to `/login`
```javascript
toast.info('Your account is under review...');
window.location.href = '/login';
```

**After**: Redirects directly to `/profile-verification`
```javascript
window.location.href = '/profile-verification';
```

### 2. Login Page (`src/app/login/page.tsx`)
Updated **4 locations** where pending review status is checked:

#### Location 1: Initial Auth Check
**Before**: Showed toast and stayed on login page
```javascript
toast.info('Your account is under review...');
setIsCheckingAuth(false);
return;
```

**After**: Redirects to profile verification
```javascript
router.replace('/profile-verification');
return;
```

#### Location 2: OTP Verification
**Before**: Showed toast and stayed on login page
```javascript
toast.info('Your account is under review...');
return;
```

**After**: Redirects to profile verification
```javascript
router.replace('/profile-verification');
return;
```

#### Location 3: Social Login (Existing User)
**Before**: Showed toast and cleaned URL
```javascript
toast.info('Your account is under review...');
window.history.replaceState({}, document.title, '/login');
return;
```

**After**: Redirects to profile verification
```javascript
router.replace('/profile-verification');
return;
```

#### Location 4: Social Login (New Signup)
**Before**: Showed toast and cleaned URL
```javascript
toast.info('Account created successfully! Your account is pending...');
window.history.replaceState({}, document.title, '/login');
```

**After**: Stores temp token and redirects
```javascript
// Store temp token for profile verification page
if (tempToken && userId) {
  localStorage.setItem('temp_auth_token', tempToken);
  localStorage.setItem('user_id', userId);
}
router.replace('/profile-verification');
```

## User Flow

### Before Changes:
```
User Logs In
    ↓
account_status = "pending_review"
    ↓
Toast Notification: "Your account is under review..."
    ↓
Stay on Login Page
    ↓
User confused (can't access dashboard)
```

### After Changes:
```
User Logs In
    ↓
account_status = "pending_review"
    ↓
Redirect to /profile-verification
    ↓
Shows PendingReviewSection Component
    ↓
Clear message: "Account pending approval"
    ↓
User understands status
```

## Profile Verification Page
The `/profile-verification` page shows the `PendingReviewSection` component which displays:
- ✅ Clear status message
- ✅ Information about review process
- ✅ Expected timeline
- ✅ Contact information if needed
- ✅ Professional UI matching the brand

## Benefits

1. **Better UX**: Dedicated page instead of toast notification
2. **Clear Communication**: Users see full explanation of pending status
3. **Consistent Flow**: Same page for all pending review scenarios
4. **No Confusion**: Users don't try to login repeatedly
5. **Professional**: Proper status page instead of error message

## Testing Scenarios

### Scenario 1: Email/OTP Login with Pending Account
1. User enters email
2. Receives OTP
3. Verifies OTP
4. Backend returns `account_status: "pending_review"`
5. User redirected to `/profile-verification`
6. Sees pending review message

### Scenario 2: Social Login (Existing User)
1. User clicks Google/LinkedIn
2. Authenticates with social provider
3. Backend returns `account_status: "pending_review"`
4. User redirected to `/profile-verification`
5. Sees pending review message

### Scenario 3: Social Login (New Signup)
1. User clicks Google/LinkedIn
2. Creates new account
3. Backend returns `account_status: "pending_review"`
4. Temp token stored in localStorage
5. User redirected to `/profile-verification`
6. Sees pending review message

### Scenario 4: Direct Dashboard Access
1. User tries to access `/dashboard` directly
2. Dashboard checks localStorage for user_data
3. Finds `account_status: "pending_review"`
4. User redirected to `/profile-verification`
5. Sees pending review message

### Scenario 5: Already Logged In (Pending)
1. User has pending account and is logged in
2. Opens website
3. Login page checks localStorage
4. Finds `account_status: "pending_review"`
5. User redirected to `/profile-verification`
6. Sees pending review message

## LocalStorage Keys Used

- `auth_token`: Authentication token (may be temp or permanent)
- `user_data`: User information including account_status
- `user_id`: User ID
- `temp_auth_token`: Temporary token for new signups (stored for profile verification page)

## Files Modified

1. ✅ `src/app/dashboard/page.tsx` - Dashboard redirect
2. ✅ `src/app/login/page.tsx` - Login page redirects (4 locations)
3. ✅ `src/components/ui/ProfileCompletionCard.tsx` - Fixed unused import

## Console Logs for Debugging

All redirects log to console:
```javascript
console.log('[Dashboard] Account pending review, redirecting to profile verification');
console.log('[Auth Check] Account pending review, redirecting to profile verification');
console.log('[OTP Verify] Account pending review, redirecting to profile verification');
console.log('[Social Callback] Account pending review, redirecting to profile verification');
console.log('[Social Callback] New signup - pending review, redirecting to profile verification');
```

## Future Enhancements

- [ ] Add email notification when account is approved
- [ ] Add admin panel to approve/reject accounts
- [ ] Add estimated review time on pending page
- [ ] Add ability to check status without logging in
- [ ] Add support ticket system for pending users
