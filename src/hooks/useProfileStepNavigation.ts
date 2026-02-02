import { useState, useEffect } from 'react';

const STORAGE_KEY = 'profile_current_step';
const TOTAL_STEPS = 6;

// Helper function to get initial step synchronously
const getInitialStep = (): number => {
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

export const useProfileStepNavigation = () => {
  // Initialize with saved step immediately
  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Initialize step from sessionStorage only (no URL parameter support)
  useEffect(() => {
    // Only use sessionStorage, ignore URL parameters
    const savedStep = sessionStorage.getItem(STORAGE_KEY);
    
    if (savedStep) {
      const stepNumber = parseInt(savedStep, 10);
      if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS) {
        setCurrentStep(stepNumber);
        return;
      }
    }

    // Default to step 1
    setCurrentStep(1);
    sessionStorage.setItem(STORAGE_KEY, '1');
  }, [forceRefresh]); // Add forceRefresh dependency

  // Listen for storage changes from other tabs/pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const newStep = parseInt(e.newValue, 10);
        if (newStep >= 1 && newStep <= TOTAL_STEPS) {
          setCurrentStep(newStep);
        }
      }
    };

    // Also listen for custom events for same-tab navigation
    const handleCustomNavigation = () => {
      setForceRefresh(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileStepChanged', handleCustomNavigation);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileStepChanged', handleCustomNavigation);
    };
  }, []);

  // Save to sessionStorage whenever step changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      // No URL changes - keep URL clean as /dashboard/profile
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      navigateToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const clearStepStorage = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    navigateToStep,
    nextStep,
    prevStep,
    skipStep,
    clearStepStorage,
    isFirstStep,
    isLastStep
  };
};