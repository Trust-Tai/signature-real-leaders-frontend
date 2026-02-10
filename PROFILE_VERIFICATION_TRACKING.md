# Profile Verification Conversion Tracking

This document explains the conversion tracking implementation for the profile verification completion process.

## Required IDs Setup

### 1. Google Tag Manager ID ✅ (Already Configured)
- **Current**: `GTM-TT86VCLZ`
- **Status**: Working - Events will be sent via dataLayer

### 2. Google Analytics 4 (GA4) Measurement ID (Recommended)
- **Format**: `G-XXXXXXXXXX`
- **Where to get**: Google Analytics > Admin > Data Streams > Web > Measurement ID
- **Add to .env.local**: `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`

### 3. Google Ads Conversion ID (Optional)
- **Format**: `AW-XXXXXXXXX/XXXXXXXXX`
- **Where to get**: Google Ads > Tools & Settings > Conversions
- **Add to .env.local**: `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX/XXXXXXXXX`

## Current Working Setup

**Right now, your tracking will work with just GTM** because:
- GTM ID (`GTM-TT86VCLZ`) is already configured
- Events are sent via `dataLayer.push()` to GTM
- You can configure GA4 and Google Ads within GTM dashboard

## Environment Variables

Add these to your `.env.local` file:

```bash
# Already configured
NEXT_PUBLIC_GTM_ID=GTM-TT86VCLZ

# Add these for enhanced tracking (optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX/XXXXXXXXX
```

## Implementation Overview

When a user completes the profile verification process (reaches the final "Complete" step), the system now fires conversion tracking events for Google Analytics 4 (GA4) and Google Ads.

## Events Fired

### Primary Conversion Event
- **Event Name**: `profile_application_completed`
- **Category**: `profile_verification`
- **Label**: `verification_completed`
- **Value**: 1
- **Currency**: USD

### Alternative Event Names
- `verification_started` - Tracks when verification process is completed
- `submit_application_success` - Alternative event name for flexibility

### Tracking Methods
1. **Google Tag Manager (dataLayer)** - Primary method
2. **gtag (GA4)** - Direct GA4 tracking
3. **Google Ads Conversion** - For conversion import

## Files Modified

### 1. `src/lib/conversionTracking.ts` (New File)
Contains utility functions for tracking conversion events:
- `trackProfileVerificationSuccess()` - Fires when verification is completed
- `trackProfileVerificationStart()` - Fires when verification process starts

### 2. `src/app/profile-verification/page.tsx`
- Added conversion tracking import
- Modified `nextStep()` function to fire success event when reaching step 4
- Added start tracking when component mounts

### 3. `src/components/ui/PendingReviewSection.tsx`
- Added backup conversion tracking when the final success page is displayed
- Ensures event is fired even if user navigates directly to final step

## Setup Instructions

### Option 1: GTM Only (Easiest - Already Working!)
Your current setup with `GTM-TT86VCLZ` will work immediately:

1. **Events are already being sent** to GTM via dataLayer
2. **In GTM Dashboard**:
   - Go to your GTM container (`GTM-TT86VCLZ`)
   - Create triggers for event `profile_application_completed`
   - Add GA4 and Google Ads tags using these triggers
   - Publish the container

### Option 2: Direct GA4 + Google Ads (Advanced)
For direct tracking, add these environment variables:

1. **Get GA4 Measurement ID**:
   - Go to Google Analytics > Admin > Data Streams
   - Click your web stream > Copy Measurement ID (G-XXXXXXXXXX)
   - Add to `.env.local`: `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`

2. **Get Google Ads Conversion ID** (if using Google Ads):
   - Go to Google Ads > Tools & Settings > Conversions
   - Create new conversion or copy existing ID (AW-XXXXXXXXX/XXXXXXXXX)
   - Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX/XXXXXXXXX`

3. **Mark as Conversion in GA4**:
   - Go to Admin > Events > Conversions
   - Toggle "Mark as conversion" for `profile_application_completed`

4. **Import to Google Ads**:
   - In Google Ads, go to Conversions > Import > GA4
   - Select `profile_application_completed` event

## Testing

To test the implementation:

1. Complete the profile verification process
2. Check browser console for tracking logs:
   ```
   [Conversion Tracking] Profile verification success event pushed to dataLayer
   [Conversion Tracking] Profile verification success events sent via gtag
   ```
3. Verify events in GA4 Real-time reports
4. Use Google Tag Assistant or similar tools to verify dataLayer events

## Event Data Structure

```javascript
{
  event: 'profile_application_completed',
  event_category: 'profile_verification',
  event_label: 'verification_completed',
  value: 1,
  currency: 'USD',
  conversion: true,
  custom_parameters: {
    verification_step: 'final_completion',
    completion_timestamp: '2024-02-04T...',
    page_path: '/profile-verification'
  }
}
```

## Notes

- Events are fired both when transitioning to step 4 and when the PendingReviewSection component mounts (backup)
- All tracking is wrapped in try-catch blocks to prevent errors from breaking the user experience
- Console logging is included for debugging purposes
- The implementation is compatible with the existing GTM setup in the project