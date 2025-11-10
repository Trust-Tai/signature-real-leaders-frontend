# Dashboard Tour Guide & Profile Completion Feature

## Overview
Dashboard par ab do naye features add kiye gaye hain:
1. **Tour Guide** - First-time users ke liye sidebar menu items ka guided tour
2. **Profile Completion Card** - Incomplete profile fields ko complete karne ke liye reminder

## Features Implemented

### 1. Tour Guide (@sjmc11/tourguidejs)
- **Location**: `src/components/ui/DashboardTour.tsx`
- **Trigger**: Automatically starts when user first visits dashboard
- **Steps**: 9 steps covering all sidebar menu items:
  - Dashboard Overview
  - Bookings This Month
  - Newsletter Subscribers
  - Followers
  - Page Views
  - Total Link Clicks
  - Audience Demographics
  - Magic Publishing

#### Tour Controls:
- **Next Button**: Move to next step
- **Skip Button**: Skip entire tour
- **Close Button**: Close tour (same as skip)

#### Tour Behavior:
- Tour automatically starts for first-time users
- Once completed/skipped, it won't show again (stored in localStorage: `dashboard_tour_completed`)
- After tour completion, profile completion card shows automatically if profile is incomplete

### 2. Profile Completion Card
- **Location**: `src/components/ui/ProfileCompletionCard.tsx`
- **Position**: Fixed at bottom-right corner
- **Shows When**:
  - Tour is completed/skipped AND
  - Profile completion is less than 100%

#### Card Features:
- Progress bar showing completion percentage
- List of incomplete fields with readable labels
- "Complete Setup" button navigating to `/dashboard/profile`
- Close button to dismiss (stored in localStorage: `profile_card_dismissed`)

### 3. API Integration
- **Existing Endpoint Used**: `/user/user-details`
- **Location**: `src/lib/api.ts`
- **Profile Completion Data**: Already included in user-details response at root level
- **Response Format**:
```typescript
{
  success: boolean;
  user: {
    // ... all user fields
  };
  profile_completion?: {
    percentage: number;
    steps: number;
    total_steps: number;
    missing_fields: string[];  // Array of readable field names
  }
}
```

## Implementation Details

### Dashboard Page Changes (`src/app/dashboard/page.tsx`)
1. Uses existing `getUserDetails()` API to fetch profile completion data
2. Tour shows first for new users
3. Profile completion card shows after tour (if profile incomplete)
4. Both features work independently
5. No separate API call needed - data comes from user-details endpoint

### Sidebar Changes (`src/components/ui/UserProfileSidebar.tsx`)
- Added `data-tour` attributes to all menu items for tour targeting
- Tour IDs: `dashboard`, `bookings`, `subscribers`, `followers`, `page-views`, `link-clicks`, `demographics`, `magic-publishing`

### Styling (`src/app/globals.css`)
- Tour guide styles already present
- Added slide-up animation for profile completion card
- Custom tour dialog styling with brand colors

## User Flow

### First Time User:
1. User logs in and lands on dashboard
2. Profile completion API is called
3. Tour guide starts automatically
4. User can either:
   - Go through all steps (Next → Next → ... → Finish)
   - Skip the tour (Skip button)
5. After tour completion, if profile is incomplete:
   - Profile completion card appears at bottom-right
   - Shows incomplete fields and completion percentage
   - User can click "Complete Setup" to go to profile page
   - Or close the card to dismiss

### Returning User:
1. Tour won't show (already completed)
2. If profile still incomplete:
   - Profile completion card shows directly
3. If profile is 100% complete:
   - No cards/tours show

## LocalStorage Keys
- `dashboard_tour_completed`: 'true' when tour is completed/skipped
- `profile_card_dismissed`: 'true' when user closes profile completion card

## API Requirements

### Backend Endpoint (Already Exists):
```
GET /wp-json/verified-real-leaders/v1/user/user-details
Authorization: Bearer {token}

Actual Response Format:
{
  "success": true,
  "user": {
    // ... all user fields
  },
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

**Note**: Profile completion data is at root level of response, not inside user object.

### Missing Fields (from API):
The API returns field names in readable format:
- "Audience Description"
- "Newsletter Service"
- "API Key"
- "Date of Birth"
- "Occupation"
- "Profile Privacy"
- etc.

These are displayed as-is in the profile completion card.

## Testing

### To Test Tour:
1. Clear localStorage: `localStorage.removeItem('dashboard_tour_completed')`
2. Refresh dashboard page
3. Tour should start automatically

### To Test Profile Card:
1. Complete/skip tour first
2. Ensure profile completion API returns < 100%
3. Profile card should appear at bottom-right

### To Reset Everything:
```javascript
localStorage.removeItem('dashboard_tour_completed');
localStorage.removeItem('profile_card_dismissed');
location.reload();
```

## Dependencies
- `@sjmc11/tourguidejs`: ^0.0.27 (already installed)
- No additional dependencies needed

## Technical Implementation Notes

### SSR Compatibility
- TourGuideJS is loaded dynamically using `import()` to avoid SSR issues
- The library is only loaded on the client side when needed
- CSS is imported globally in `globals.css`

### Tour Guide Library
- Using `TourGuideClient` from `@sjmc11/tourguidejs/dist/tour`
- CSS imported from `@sjmc11/tourguidejs/dist/css/tour.min.css`
- Dynamic import prevents "self is not defined" error during build

## Notes
- Tour guide is non-intrusive and can be skipped anytime
- Profile completion card can be dismissed but will show again on next visit (unless profile is completed)
- Both features are mobile-responsive
- Tour steps are ordered and show progress (Step 1 of 9, etc.)
