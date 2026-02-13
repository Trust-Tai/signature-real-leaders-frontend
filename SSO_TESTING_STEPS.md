# SSO Testing Steps (Updated)

## Issue Fixed
WordPress se token aa raha tha lekin `logged_in=true` parameter missing tha. Ab code update kar diya hai - token aane pe directly store ho jayega aur page reload hoga.

## Test Karne Ke Liye

### Method 1: Direct Dashboard Access (Recommended)

```bash
1. Pehle logout karo dono platforms se
   - Frontend: https://app.real-leaders.com
   - WordPress: https://real-leaders.com/wp-admin

2. WordPress mein login karo
   - Visit: https://real-leaders.com/wp-admin
   - Login credentials enter karo

3. Ab directly dashboard pe jao
   - Visit: https://app.real-leaders.com/dashboard
   
4. Kya hoga:
   - AuthGuard check karega - token nahi hai
   - Automatically WordPress SSO check pe redirect hoga
   - WordPress token generate karega
   - Dashboard pe wapas aayega with token
   - Page reload hoga
   - User logged in ho jayega!
```

### Method 2: Test Page (For Debugging)

```bash
1. WordPress mein login karo
   - Visit: https://real-leaders.com/wp-admin

2. Test page pe jao
   - Visit: https://app.real-leaders.com/sso-test

3. Page pe "SSO Check Session" link pe click karo
   - Yeh WordPress SSO endpoint pe jayega
   - Token ke saath wapas aayega
   - Logs mein sab kuch dikhai dega

4. "Go to Dashboard" button click karo
   - Dashboard pe navigate ho jayega
   - User logged in hoga
```

## Console Logs Dekhne Ke Liye

Browser console (F12) mein yeh logs dikhenge:

```javascript
// When SSO callback is received:
[SSO] Received auth token from WordPress
[SSO] Token: eyJ0eXAiOiJKV1QiLCJh...
[SSO] logged_in parameter: true (or null)
[SSO] Token stored, reloading page...

// After reload:
[AuthGuard] Token found, allowing access
[UserContext] Fetching user details...
```

## Agar Kaam Nahi Kara Toh

### Debug Commands (Browser Console):

```javascript
// 1. Check if token is stored
localStorage.getItem('auth_token')

// 2. Check user data
JSON.parse(localStorage.getItem('user_data'))

// 3. Manually test WordPress SSO endpoint
window.location.href = 'https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=https://app.real-leaders.com/sso-test'

// 4. Clear everything and start fresh
localStorage.clear()
window.location.href = '/login'
```

## Expected Flow

```
User visits dashboard without token
         ↓
AuthGuard detects no token
         ↓
Redirects to WordPress SSO check
         ↓
WordPress checks session
         ↓
User is logged in WordPress
         ↓
WordPress generates token
         ↓
Redirects back: /dashboard?auth_token=XXX
         ↓
SSOProvider detects auth_token
         ↓
Stores token in localStorage
         ↓
Cleans URL (removes parameters)
         ↓
Reloads page
         ↓
AuthGuard finds token
         ↓
UserContext fetches user details
         ↓
Dashboard loads successfully!
```

## Network Tab Mein Check Karo

1. Open DevTools (F12)
2. Network tab pe jao
3. Yeh requests dikhni chahiye:

```
1. GET /dashboard
   → 302 Redirect to WordPress SSO

2. GET https://real-leaders.com/.../sso/check-session?redirect_url=...
   → 302 Redirect back with token

3. GET /dashboard?auth_token=XXX
   → Page loads, token stored

4. GET /dashboard (after reload)
   → 200 OK, dashboard loads

5. GET https://real-leaders.com/.../user/user-details
   → 200 OK, user data fetched
```

## Common Issues

### Issue 1: Token nahi aa raha
**Solution:** WordPress SSO endpoint check karo
```bash
# Browser mein directly test karo (WordPress mein logged in hoke):
https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=https://app.real-leaders.com/sso-test
```

### Issue 2: Token aa raha hai but store nahi ho raha
**Solution:** Console logs check karo
```javascript
// Console mein yeh log dikhai dena chahiye:
[SSO] Token stored, reloading page...

// Agar nahi dikha toh manually store karo:
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE')
window.location.reload()
```

### Issue 3: Page reload ke baad bhi login nahi ho raha
**Solution:** UserContext check karo
```javascript
// Console mein yeh error aa sakta hai:
// "Failed to fetch user details"

// API endpoint manually test karo:
fetch('https://real-leaders.com/wp-json/verified-real-leaders/v1/user/user-details', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  }
})
.then(r => r.json())
.then(console.log)
```

## Quick Test Script

Browser console mein yeh script run karo:

```javascript
// Complete SSO Flow Test
(async () => {
  console.log('=== SSO Flow Test ===\n');
  
  // Step 1: Clear everything
  console.log('1. Clearing localStorage...');
  localStorage.clear();
  
  // Step 2: Simulate WordPress redirect with token
  console.log('2. Simulating WordPress SSO callback...');
  const testToken = prompt('Enter token from WordPress (or press Cancel to skip):');
  
  if (testToken) {
    // Store token
    localStorage.setItem('auth_token', testToken);
    console.log('3. Token stored!');
    
    // Test API call
    console.log('4. Testing user details API...');
    try {
      const response = await fetch(
        'https://real-leaders.com/wp-json/verified-real-leaders/v1/user/user-details',
        {
          headers: {
            'Authorization': `Bearer ${testToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      
      if (data.success) {
        console.log('5. ✅ API Success!');
        console.log('   User:', data.user.email);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        console.log('6. User data stored!');
        console.log('\n✅ SSO Flow Complete! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        console.error('5. ❌ API Failed:', data.message);
      }
    } catch (error) {
      console.error('5. ❌ API Error:', error);
    }
  } else {
    console.log('Test cancelled. Visit WordPress SSO endpoint manually:');
    console.log('https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=https://app.real-leaders.com/sso-test');
  }
})();
```

## Success Indicators

✅ Console mein `[SSO] Token stored, reloading page...` dikhai de
✅ localStorage mein `auth_token` aur `user_data` store ho jaye
✅ Dashboard load ho jaye without login page
✅ User profile dropdown mein user ka naam dikhai de
✅ Network tab mein user-details API call successful ho

## Final Test Checklist

- [ ] WordPress mein login kiya
- [ ] Dashboard URL visit kiya
- [ ] Automatically WordPress SSO pe redirect hua
- [ ] Token ke saath wapas aaya
- [ ] Page reload hua
- [ ] Dashboard successfully load hua
- [ ] User logged in hai

Agar sab steps successful hain toh SSO properly kaam kar raha hai! 🎉
