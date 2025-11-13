# Profile Verification Multi-Step Flow Plan

## New Step Structure:
1. **Email Verification** - SimplifiedEmailVerificationSection
2. **Code Verification** - CodeVerificationSection  
3. **Information Form** - InformationFormSection
4. **Links** - LinksSection
5. **Signature** - SignSection
6. **Pending Review** - PendingReviewSection

## Data Flow:
- Each step collects data and stores in OnboardingContext state
- Final submission happens in SignSection (step 5)
- All collected data from steps 1-5 sent to API together
- After successful submission, move to step 6 (Pending Review)

## API Call:
- Endpoint: `/user/submit-user-info`
- Called from: SignSection component
- Payload includes:
  - Email (from step 1)
  - Auth token (from step 2)
  - Personal info (from step 3)
  - Links array (from step 4)
  - Signature file (from step 5)
  - All other form data

## Implementation Steps:
1. Update profile-verification page to have 6 steps
2. Update step rendering logic
3. Update OnboardingContext to store all form data
4. Update SignSection to call API with all data
5. Handle success/error states
6. Navigate to step 6 on success
