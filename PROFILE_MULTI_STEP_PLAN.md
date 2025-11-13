# Profile Page Multi-Step Wizard Plan

## Current State
- Single long form with all fields
- No step-by-step guidance
- Hard to track progress
- No skip functionality

## New Multi-Step Structure

### Step 1: Personal Information
- First Name, Last Name
- Company Name, Website
- Industry, Employees
- Email List Size
- About/Bio
- Profile Picture
- **Skip Button**: Yes

### Step 2: Links
- Social media links
- Custom links
- Work with me, Donations, etc.
- **Skip Button**: Yes

### Step 3: Signature
- Draw or upload signature
- **Skip Button**: No (required for profile completion)

### Step 4: Profile Template
- Select profile template design
- **Skip Button**: Yes (can use default)

### Step 5: Newsletter (Optional)
- Newsletter service selection
- API key configuration
- **Skip Button**: Yes

### Step 6: Success Metrics (Optional)
- Number of bookings
- Email list size
- Sales amount
- Donations amount
- **Skip Button**: Yes

## Features

### Progress Indicator
- Show current step / total steps
- Visual progress bar
- Step titles

### Navigation
- Next button (validates current step)
- Back button (go to previous step)
- Skip button (where applicable)
- Save & Exit (save progress and return to dashboard)

### Data Persistence
- Save data after each step
- Load existing data on page load
- Show what's already filled

### Final Submission
- Collect all data from all steps
- Call `updateProfile` API
- Show success message
- Redirect to dashboard

## API Integration

### Load Existing Data
```
GET /user/user-details
- Pre-fill all form fields with existing data
```

### Update Profile
```
POST /user/update-profile
- Send all collected data
- Update only changed fields
```

## Components to Reuse
1. ✅ InformationFormSection (Step 1)
2. ✅ LinksSection (Step 2)
3. ✅ SignSection (Step 3)
4. ✅ ProfileTemplateSection (Step 4)
5. ✅ NewsletterSetupSection (Step 5)
6. Create new: SuccessMetricsSection (Step 6)

## Implementation Steps
1. Create multi-step wrapper component
2. Add step navigation logic
3. Add progress indicator
4. Integrate existing form components
5. Add skip functionality
6. Add save & exit
7. Implement final submission
8. Add loading states
9. Add error handling
10. Test complete flow

## Benefits
- ✅ Better UX - step by step guidance
- ✅ Less overwhelming - one section at a time
- ✅ Progress tracking - users see completion
- ✅ Flexibility - can skip optional sections
- ✅ Save progress - don't lose data
- ✅ Mobile friendly - smaller forms per screen
