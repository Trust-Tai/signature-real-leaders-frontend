/**
 * Utility functions for profile step navigation
 * Can be used from anywhere in the application to navigate to specific profile steps
 */

const STORAGE_KEY = 'profile_current_step';
const TOTAL_STEPS = 6;

/**
 * Navigate to a specific profile step from anywhere in the app
 * @param step - Step number (1-6)
 * @param router - Next.js router instance
 */
export const navigateToProfileStep = (step: number, router: { push: (url: string) => void }) => {
  if (step >= 1 && step <= TOTAL_STEPS) {
    // Save step to sessionStorage
    sessionStorage.setItem(STORAGE_KEY, step.toString());
    
    // Dispatch custom event to notify profile page
    window.dispatchEvent(new CustomEvent('profileStepChanged'));
    
    // Navigate to profile page without step parameter (clean URL)
    router.push('/dashboard/profile');
  } else {
    console.warn(`Invalid profile step: ${step}. Must be between 1 and ${TOTAL_STEPS}`);
  }
};

/**
 * Get the current profile step from sessionStorage
 * @returns Current step number or 1 if not set
 */
export const getCurrentProfileStep = (): number => {
  if (typeof window === 'undefined') return 1;
  
  const savedStep = sessionStorage.getItem(STORAGE_KEY);
  if (savedStep) {
    const stepNumber = parseInt(savedStep, 10);
    if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS) {
      return stepNumber;
    }
  }
  return 1;
};

/**
 * Clear the profile step from sessionStorage
 * Usually called when the profile form is completed
 */
export const clearProfileStep = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Set the profile step in sessionStorage without navigation
 * @param step - Step number (1-6)
 */
export const setProfileStep = (step: number) => {
  if (typeof window !== 'undefined' && step >= 1 && step <= TOTAL_STEPS) {
    sessionStorage.setItem(STORAGE_KEY, step.toString());
  }
};

/**
 * Profile step names for reference
 */
export const PROFILE_STEP_NAMES = {
  1: 'Personal Info',
  2: 'Links',
  3: 'Signature',
  4: 'Template',
  5: 'Newsletter',
  6: 'Metrics & Tracking'
} as const;

/**
 * Get step name by number
 * @param step - Step number
 * @returns Step name or 'Unknown Step'
 */
export const getProfileStepName = (step: number): string => {
  return PROFILE_STEP_NAMES[step as keyof typeof PROFILE_STEP_NAMES] || 'Unknown Step';
};