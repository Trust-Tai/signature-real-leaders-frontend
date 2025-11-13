# Profile Multi-Step Implementation Guide

## Current Status
- Profile page: 1474 lines
- All forms in single page
- No step navigation
- No skip functionality

## Implementation Plan

### Phase 1: Add Multi-Step Infrastructure (PRIORITY)
1. Add step state management
2. Add progress indicator UI
3. Add navigation buttons (Next, Skip, Back)
4. Add step rendering logic

### Phase 2: Convert Existing Forms to Steps
**Step 1: Personal Information**
- Keep existing information form
- Add skip button
- Collect: firstName, lastName, company, industry, etc.

**Step 2: Links**
- Keep existing links form
- Add skip button
- Collect: social media links array

**Step 3: Signature**
- Keep existing signature canvas/upload
- Add skip button
- Collect: signature file

**Step 4: Profile Template**
- Keep existing template selection
- Add skip button
- Collect: template ID

**Step 5: Newsletter**
- Keep existing newsletter form
- Add skip button
- Collect: service, API keys

**Step 6: Success Metrics**
- Keep existing metrics form
- Add skip button
- Collect: bookings, sales, donations

### Phase 3: Final Submission
- Collect all step data
- Filter out empty/skipped fields
- Call updateProfile API
- Only send filled fields

## Skip Logic
```javascript
// If user skips a step:
- Don't add that data to payload
- Move to next step
- On final submit, only send non-empty fields

// Example:
if (links && links.length > 0) {
  payload.links = links;
}
// If links is empty/null, don't include in payload
```

## Key Features
✅ Skip button on every step
✅ Progress bar showing completion
✅ Back button to edit previous steps
✅ Save only filled data
✅ Load existing data on page load
✅ Mobile responsive

## File Size Concern
Current file is 1474 lines. After multi-step conversion, it will be ~1800-2000 lines.

This is manageable but large. Consider:
1. Keep all in one file (easier to maintain)
2. Or split into separate step components later

## Implementation Approach
Due to file size, I'll implement in multiple responses:

**Response 1:** Add multi-step infrastructure (state, navigation, progress bar)
**Response 2:** Convert Step 1 & 2 (Personal Info, Links)
**Response 3:** Convert Step 3 & 4 (Signature, Template)
**Response 4:** Convert Step 5 & 6 (Newsletter, Metrics)
**Response 5:** Add final submission logic

Each response will be a working state that can be tested.

## Ready to Start?
Confirm and I'll begin with Response 1: Multi-Step Infrastructure
