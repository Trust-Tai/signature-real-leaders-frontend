# Authentication Error Handling

This implementation automatically handles 401 Unauthorized errors across all API calls in the application.

## How it works

1. **authUtils.ts** - Contains the core authentication utilities:
   - `handleUnauthorized()` - Clears auth token and redirects to login
   - `isUnauthorizedError()` - Checks if an error is a 401 error
   - `authFetch()` - Enhanced fetch wrapper that handles 401 errors automatically

2. **Updated API files**:
   - `api.ts` - Main API functions now use `authFetch`
   - `magicPublishingApi.ts` - Magic publishing API functions now use `authFetch`

3. **Updated Components**:
   - `UserContext.tsx` - Handles 401 errors in user data fetching
   - `AuthGuard.tsx` - Imports auth utilities for consistency

## What happens on 401 error

When any API call receives a 401 Unauthorized response:

1. The auth token is immediately cleared from localStorage
2. Any other auth-related data is cleared
3. User is automatically redirected to `/login` page
4. No manual intervention required

## Usage

All existing API calls will automatically benefit from this implementation. No changes needed in components that use the API functions.

```typescript
// This will automatically handle 401 errors
const response = await api.getUserDetails(token);

// This will also automatically handle 401 errors  
const articles = await generateArticles(params, token);
```

## Files Modified

- `src/lib/authUtils.ts` (new)
- `src/lib/api.ts` (updated)
- `src/lib/magicPublishingApi.ts` (updated)
- `src/components/UserContext.tsx` (updated)
- `src/components/AuthGuard.tsx` (updated)