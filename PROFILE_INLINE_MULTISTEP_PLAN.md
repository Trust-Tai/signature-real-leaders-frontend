# Profile Page - Inline Multi-Step Implementation Plan

## Approach
- Keep everything in profile/page.tsx
- No external UI components (except basic ones like UserProfileSidebar)
- All forms inline in the same file
- Reference existing components for styling only

## Steps Structure

### Step 1: Personal Information (Inline Form)
- All fields from InformationFormSection
- Profile picture upload
- Billing address
- Additional fields
- No skip button

### Step 2: Links (Inline Form)
- Social media links dropdown
- Custom links
- Skip button available

### Step 3: Signature (Inline Form)
- Canvas for drawing
- Upload option
- No skip button

### Step 4: Profile Template (Inline Form)
- Template selection grid
- Skip button available

### Step 5: Newsletter (Inline Form)
- Service selection
- API key fields
- Skip button available

### Step 6: Success Metrics (Inline Form)
- Booking metrics
- Sales metrics
- Skip button available

## Implementation Strategy
1. Keep existing state management
2. Add step navigation state
3. Create inline form sections
4. Add progress indicator
5. Add skip functionality
6. Final API submission

## File Size Management
- Break into logical sections with comments
- Use helper functions
- Keep forms modular within same file

This is a LARGE task - will need careful implementation.
