# Dashboard Tour & Profile Completion - Testing Guide

## How to Test

### 1. Test Tour Guide

#### First Time User:
1. Clear localStorage:
   ```javascript
   localStorage.removeItem('dashboard_tour_completed');
   ```
2. Refresh dashboard page
3. Tour should start automatically
4. Check console for: `[Dashboard] Starting tour for first-time user`

#### Skip Tour:
1. Click "Skip" button or close button
2. Tour should close
3. Profile completion card should appear (if profile < 100%)

#### Complete Tour:
1. Click "Next" through all 9 steps
2. On last step, click "Finish"
3. Profile completion card should appear (if profile < 100%)

### 2. Test Profile Completion Card

#### Show Card:
1. Complete or skip tour first
2. If profile completion < 100%, card should appear at bottom-right
3. Check console for: `[Dashboard] Showing profile completion card`

#### Card Content:
- Should show percentage (e.g., "75%")
- Should show progress bar
- Should list missing fields from API response
- Should have "Complete Setup" button

#### Navigate to Profile:
1. Click "Complete Setup" button
2. Should navigate to `/dashboard/profile`

#### Close Card:
1. Click X button
2. Card should disappear
3. Won't show again until next visit (unless dismissed flag is cleared)

### 3. Console Logs to Check

When dashboard loads, you should see:
```
[Dashboard] Statistics loaded: {...}
[Dashboard] User details response: {...}
[Dashboard] Profile completion: {percentage: 75, steps: 18, total_steps: 24, missing_fields: [...]}
[Dashboard] Starting tour for first-time user
// OR
[Dashboard] Showing profile completion card
```

### 4. API Response Check

Open Network tab and check `/user/user-details` response:
```json
{
  "success": true,
  "user": { ... },
  "profile_completion": {
    "percentage": 75,
    "steps": 18,
    "total_steps": 24,
    "missing_fields": [
      "Audience Description",
      "Newsletter Service",
      "API Key",
      "Date of Birth",
      "Occupation",
      "Profile Privacy"
    ]
  }
}
```

### 5. Reset Everything

To test from scratch:
```javascript
// Clear all tour and card states
localStorage.removeItem('dashboard_tour_completed');
localStorage.removeItem('profile_card_dismissed');
location.reload();
```

### 6. Test Different Scenarios

#### Scenario 1: New User with Incomplete Profile
- Expected: Tour starts → Complete/Skip → Profile card shows

#### Scenario 2: Returning User with Incomplete Profile
- Expected: No tour → Profile card shows directly

#### Scenario 3: User with 100% Complete Profile
- Expected: No tour, no card (nothing shows)

#### Scenario 4: Tour Already Completed
- Expected: No tour → Profile card shows (if incomplete)

### 7. Mobile Testing

1. Open dashboard on mobile device or resize browser
2. Tour dialog should be responsive
3. Profile completion card should be visible at bottom-right
4. All buttons should be clickable

### 8. Common Issues & Solutions

#### Tour Not Showing:
- Check: `localStorage.getItem('dashboard_tour_completed')` should be `null` or not `'true'`
- Check: Console for any errors
- Check: DOM elements have `data-tour` attributes

#### Profile Card Not Showing:
- Check: `profile_completion.percentage < 100`
- Check: Tour is completed/skipped first
- Check: Console log shows profile completion data
- Check: API response includes `profile_completion` object

#### Missing Fields Not Displaying:
- Check: API returns `missing_fields` array
- Check: Field names are in readable format (e.g., "Date of Birth" not "date_of_birth")
- Check: Console log shows `missing_fields` array

### 9. Browser DevTools Commands

```javascript
// Check tour status
localStorage.getItem('dashboard_tour_completed');

// Check card dismissed status
localStorage.getItem('profile_card_dismissed');

// Force show tour
localStorage.removeItem('dashboard_tour_completed');
location.reload();

// Force show card (after tour)
localStorage.setItem('dashboard_tour_completed', 'true');
localStorage.removeItem('profile_card_dismissed');
location.reload();
```

### 10. Expected User Flow

```
User Logs In
    ↓
Dashboard Loads
    ↓
Fetch user-details API
    ↓
Check profile_completion
    ↓
    ├─→ Tour not completed? → Start Tour
    │       ↓
    │   User completes/skips tour
    │       ↓
    │   Profile < 100%? → Show Card
    │
    └─→ Tour completed? → Profile < 100%? → Show Card
```
