# Newsletter Subscription User ID Fix

## Overview
Newsletter subscription API me ab **profile owner ki user_id** jayegi instead of visitor ki user_id. Jab koi visitor (logged-in ya non-logged-in) kisi profile par newsletter subscribe karta hai, tab us profile ke owner ki user_id API me send hogi.

## Problem
Pehle newsletter subscription API me **visitor ki user_id** ja rahi thi, jo galat tha. Hume **profile owner ki user_id** chahiye thi.

## Solution
Updated both newsletter subscription functions to send **profile owner's user_id** (`profileData?.user_id`).

## Changes Made

### File: `src/app/[username]/page.tsx`

#### 1. Logged-in User Subscription
**Function:** `handleNewsletterCheckboxChange`

**Before:**
```typescript
body: JSON.stringify({
  email: email,
  first_name: firstName,
  last_name: lastName,
  user_id: userId  // ❌ Visitor's user_id
})
```

**After:**
```typescript
body: JSON.stringify({
  email: email,
  first_name: firstName,
  last_name: lastName,
  user_id: profileData?.user_id  // ✅ Profile owner's user_id
})
```

#### 2. Non-logged-in User Subscription
**Function:** `handleNewsletterSubmit`

**Before:**
```typescript
body: JSON.stringify({
  email: newsletterData.email,
  first_name: newsletterData.first_name,
  last_name: newsletterData.last_name,
  ...(userId && { user_id: userId })  // ❌ Visitor's user_id (if available)
})
```

**After:**
```typescript
body: JSON.stringify({
  email: newsletterData.email,
  first_name: newsletterData.first_name,
  last_name: newsletterData.last_name,
  user_id: profileData?.user_id  // ✅ Profile owner's user_id
})
```

## API Endpoint

```
POST https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/newsletter/add-subscriber
```

### Request Body
```json
{
  "email": "visitor@example.com",
  "first_name": "Visitor",
  "last_name": "Name",
  "user_id": 2515  // Profile owner's user_id
}
```

## Flow Explanation

### Scenario 1: Logged-in Visitor
1. Visitor views profile: `/@johndoe`
2. Profile owner's user_id: `2515`
3. Visitor clicks newsletter checkbox
4. API call with:
   - `email`: Visitor's email
   - `first_name`: Visitor's first name
   - `last_name`: Visitor's last name
   - `user_id`: `2515` (Profile owner's ID)

### Scenario 2: Non-logged-in Visitor
1. Visitor views profile: `/@johndoe`
2. Profile owner's user_id: `2515`
3. Visitor clicks newsletter checkbox
4. Modal opens for visitor details
5. Visitor enters: first name, last name, email
6. API call with:
   - `email`: Visitor's entered email
   - `first_name`: Visitor's entered first name
   - `last_name`: Visitor's entered last name
   - `user_id`: `2515` (Profile owner's ID)

## Benefits

### 1. Correct Newsletter Association
- Newsletter subscriptions ab sahi profile owner se associate honge
- Profile owner ko pata chalega ki kaun unke newsletter ko subscribe kar raha hai

### 2. Better Analytics
- Profile owner apne subscribers ko track kar sakte hain
- Accurate subscriber count per profile owner

### 3. Proper Data Structure
- Backend me data properly organized hoga
- Each profile owner ke subscribers alag-alag tracked honge

## Testing

### Test Case 1: Logged-in User Subscribes
1. Login as User A
2. Visit User B's profile (`/@userb`)
3. Click newsletter checkbox
4. API should send:
   - Visitor details: User A's email, first name, last name
   - user_id: User B's user_id

### Test Case 2: Non-logged-in User Subscribes
1. Open profile in incognito: `/@userb`
2. Click newsletter checkbox
3. Enter details in modal
4. Submit
5. API should send:
   - Visitor details: Entered email, first name, last name
   - user_id: User B's user_id

### Test Case 3: User Subscribes to Own Profile
1. Login as User A
2. Visit own profile (`/@usera`)
3. Click newsletter checkbox
4. API should send:
   - Visitor details: User A's email, first name, last name
   - user_id: User A's user_id (same user)

## Data Flow

```
Visitor → Views Profile → Clicks Subscribe
    ↓
Profile Data Loaded
    ↓
profileData.user_id = Profile Owner's ID
    ↓
Newsletter API Call
    ↓
{
  email: visitor_email,
  first_name: visitor_first_name,
  last_name: visitor_last_name,
  user_id: profile_owner_id  ← Profile owner's ID
}
    ↓
Backend Associates Subscription with Profile Owner
```

## Backend Expected Behavior

Backend should:
1. Receive subscription request with profile owner's user_id
2. Add visitor's email to profile owner's newsletter list
3. Associate subscription with correct profile owner
4. Return success/error message

## Notes

- `profileData?.user_id` is available from the profile fetch API
- This ensures correct association regardless of visitor's login status
- Visitor's details (email, name) are still captured for the subscription
- Only the `user_id` parameter determines which profile owner's list the subscription goes to

## Impact

✅ **Correct Data Association**: Subscriptions now properly linked to profile owners  
✅ **Better Analytics**: Profile owners can track their subscribers accurately  
✅ **Proper Newsletter Management**: Each profile owner has their own subscriber list  
✅ **No Breaking Changes**: API endpoint and response format remain the same
