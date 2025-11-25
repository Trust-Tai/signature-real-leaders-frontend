# Tour Guide Trigger Flow - Complete Guide

## Overview
Yeh document explain karta hai ki tour guide kab aur kaise show hota hai users ko.

## Tour Guide Kab Show Hoga? 🎯

### Condition: First-Time User
Tour guide **sirf first-time users** ko show hota hai jab:
1. User pehli baar login karta hai
2. User ka `tour_guide` status database mein `false` hai
3. User Magic Publishing page pe land karta hai (default dashboard)

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGS IN                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Redirect to /dashboard/magic-publishing              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│     Magic Publishing Page Loads (useEffect runs)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│   Check: Get user details from API (getUserDetails)         │
│   Check user.tour_guide status                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────┴───────┐
                    │               │
            tour_guide = false   tour_guide = true
                    │               │
                    ↓               ↓
        ┌──────────────────┐   ┌──────────────────┐
        │ SHOW WELCOME     │   │ NO TOUR          │
        │ MODAL            │   │ (Returning User) │
        └──────────────────┘   └──────────────────┘
                    ↓
        ┌──────────────────────────────────┐
        │  Welcome Modal Appears           │
        │  "Welcome to Real Leaders! 🎉"   │
        │                                  │
        │  Two Options:                    │
        │  1. Start guided tour            │
        │  2. Complete Your Profile        │
        └──────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        │                       │
    User clicks           User clicks
    "Start Tour"          "Complete Profile"
        │                       │
        ↓                       ↓
┌──────────────────┐   ┌──────────────────┐
│ TOUR STARTS      │   │ Redirect to      │
│ (5 Steps)        │   │ /dashboard/      │
│                  │   │ profile          │
└──────────────────┘   └──────────────────┘
        ↓
┌──────────────────────────────────────────┐
│ Tour Guide Shows 5 Steps:                │
│ 1. Magic Publishing                      │
│ 2. Newsletter Subscribers                │
│ 3. Following                             │
│ 4. Analytics Hub                         │
│ 5. Help Center                           │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│ User Completes or Exits Tour             │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│ API Call: updateTourGuideStatus()        │
│ Sets tour_guide = true in database       │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│ Tour Won't Show Again                    │
│ (User is now a returning user)           │
└──────────────────────────────────────────┘
```

## Technical Implementation

### 1. Database Field
**Table**: `users`
**Field**: `tour_guide` (boolean)
- `false` = First-time user (show tour)
- `true` = Returning user (don't show tour)

### 2. API Endpoints Used

#### Get User Details
```javascript
api.getUserDetails(token)
```
**Returns**:
```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "tour_guide": false,  // ← This determines if tour shows
    ...
  }
}
```

#### Update Tour Guide Status
```javascript
api.updateTourGuideStatus(token)
```
**Action**: Sets `tour_guide = true` in database

### 3. Component Flow

#### Magic Publishing Page (`src/app/dashboard/magic-publishing/page.tsx`)

```javascript
useEffect(() => {
  const checkTourStatus = async () => {
    // 1. Get auth token
    const token = localStorage.getItem('auth_token');
    
    // 2. Fetch user details
    const userResponse = await api.getUserDetails(token);
    
    // 3. Check tour_guide status
    if (userResponse.user.tour_guide === false) {
      // 4. Show welcome modal
      setShowWelcomeModal(true);
    }
  };
  
  checkTourStatus();
}, []);
```

### 4. User Actions

#### Option 1: Start Tour
```javascript
handleStartTour() {
  setShowWelcomeModal(false);  // Close modal
  setShowTour(true);            // Start tour
}
```

#### Option 2: Skip Tour
```javascript
handleWelcomeModalClose() {
  setShowWelcomeModal(false);           // Close modal
  await api.updateTourGuideStatus();    // Mark as completed
  // User won't see tour again
}
```

#### Tour Completion
```javascript
handleTourComplete() {
  setShowTour(false);                   // End tour
  await api.updateTourGuideStatus();    // Mark as completed
  // User won't see tour again
}
```

## Tour Guide Steps (5 Steps)

### Step 1: Magic Publishing
- **Target**: `[data-tour="magic-publishing"]`
- **Message**: "Welcome! This is your new default landing page..."
- **Location**: Sidebar - First item

### Step 2: Newsletter Subscribers
- **Target**: `[data-tour="subscribers"]`
- **Message**: "Manage and view all the people who have joined..."
- **Location**: Sidebar - Second item

### Step 3: Following
- **Target**: `[data-tour="following"]`
- **Message**: "See the RSS feeds and profiles you are following..."
- **Location**: Sidebar - Third item

### Step 4: Analytics Hub
- **Target**: `[data-tour="analytics"]`
- **Message**: "Your complete analytics center with 4 powerful tabs..."
- **Location**: Sidebar - Fourth item

### Step 5: Help Center
- **Target**: `[data-tour="help"]`
- **Message**: "Need assistance? Access our help center..."
- **Location**: Sidebar - Fifth item

## When Tour WILL Show ✅

1. **First Login**: User logs in for the first time
2. **Fresh Account**: `tour_guide = false` in database
3. **Magic Publishing Page**: User lands on default dashboard
4. **No Previous Completion**: User hasn't completed tour before

## When Tour WON'T Show ❌

1. **Returning User**: `tour_guide = true` in database
2. **Already Completed**: User completed tour in past
3. **Manually Skipped**: User clicked "Complete Your Profile" instead
4. **No Auth Token**: User not logged in properly
5. **API Error**: If getUserDetails fails

## User Scenarios

### Scenario 1: Brand New User
```
1. User creates account
2. User logs in (first time)
3. Redirects to Magic Publishing
4. Welcome Modal appears
5. User clicks "Start guided tour"
6. Tour shows 5 steps
7. User completes tour
8. tour_guide = true saved
9. Next login: No tour
```

### Scenario 2: User Skips Tour
```
1. User logs in (first time)
2. Welcome Modal appears
3. User clicks "Complete Your Profile"
4. Redirects to profile page
5. tour_guide = true saved
6. Next login: No tour
```

### Scenario 3: Returning User
```
1. User logs in (not first time)
2. tour_guide = true in database
3. Redirects to Magic Publishing
4. No Welcome Modal
5. No Tour
6. User can navigate freely
```

## localStorage Tracking

### Keys Used:
1. **`auth_token`**: Authentication token
2. **`user_data`**: User details including `tour_guide` status
3. **`dashboard_tour_completed`**: Local flag (backup)

### Example `user_data`:
```json
{
  "id": 123,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "tour_guide": false,  // ← Controls tour visibility
  "account_status": "active"
}
```

## Tour Guide Library Configuration

**Library**: `@sjmc11/tourguidejs`

**Settings**:
```javascript
{
  dialogClass: 'dashboard-tour',
  nextLabel: 'Next →',
  prevLabel: '← Back',
  finishLabel: 'Finish Tour',
  showStepProgress: true,
  showStepDots: true,
  progressBar: '#CF3232',        // Brand red color
  backdropColor: 'rgba(16, 17, 23, 0.85)',
  exitOnClickOutside: false,     // Can't close by clicking outside
  exitOnEscape: true,            // Can close with ESC key
  keyboardControls: true,        // Arrow keys work
  autoScroll: true,              // Auto-scrolls to elements
  dialogMaxWidth: 400
}
```

## Testing the Tour

### Test Case 1: First-Time User
```bash
1. Clear localStorage
2. Login with new account
3. Verify: Welcome Modal appears
4. Click "Start guided tour"
5. Verify: Tour starts with 5 steps
6. Complete tour
7. Verify: tour_guide = true in database
8. Logout and login again
9. Verify: No tour shows
```

### Test Case 2: Skip Tour
```bash
1. Clear localStorage
2. Login with new account
3. Verify: Welcome Modal appears
4. Click "Complete Your Profile"
5. Verify: Redirects to profile page
6. Verify: tour_guide = true in database
7. Navigate to Magic Publishing
8. Verify: No tour shows
```

### Test Case 3: Returning User
```bash
1. Login with existing account (tour_guide = true)
2. Verify: No Welcome Modal
3. Verify: No Tour
4. User lands directly on Magic Publishing
```

## Debugging

### Check Tour Status:
```javascript
// In browser console
const userData = JSON.parse(localStorage.getItem('user_data'));
console.log('Tour Guide Status:', userData.tour_guide);
// false = Tour will show
// true = Tour won't show
```

### Force Show Tour:
```javascript
// In browser console (for testing)
const userData = JSON.parse(localStorage.getItem('user_data'));
userData.tour_guide = false;
localStorage.setItem('user_data', JSON.stringify(userData));
// Refresh page - tour will show
```

### Reset Tour:
```javascript
// In browser console
localStorage.removeItem('dashboard_tour_completed');
const userData = JSON.parse(localStorage.getItem('user_data'));
userData.tour_guide = false;
localStorage.setItem('user_data', JSON.stringify(userData));
// Refresh page
```

## Files Involved

### Main Components:
1. **`src/app/dashboard/magic-publishing/page.tsx`** - Tour trigger logic
2. **`src/components/ui/WelcomeModal.tsx`** - Welcome modal
3. **`src/components/ui/DashboardTour.tsx`** - Tour guide component
4. **`src/components/ui/UserProfileSidebar.tsx`** - Tour targets (data-tour attributes)

### API Files:
1. **`src/lib/api.ts`** - API functions
   - `getUserDetails()`
   - `updateTourGuideStatus()`

## Summary

**Tour Guide Shows When:**
- ✅ First-time user (`tour_guide = false`)
- ✅ Lands on Magic Publishing page
- ✅ Has valid auth token
- ✅ API call succeeds

**Tour Guide Doesn't Show When:**
- ❌ Returning user (`tour_guide = true`)
- ❌ Already completed tour
- ❌ Manually skipped tour
- ❌ Not logged in

**Key Point**: Tour guide is a **one-time experience** for first-time users to help them understand the new dashboard structure.

---

**Implementation Date**: November 25, 2025
**Status**: ✅ Complete
**Trigger**: First-time user on Magic Publishing page
**Steps**: 5 interactive steps
