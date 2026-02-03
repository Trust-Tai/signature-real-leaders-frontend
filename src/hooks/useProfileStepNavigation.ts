import { useState } from 'react';

const TOTAL_STEPS = 6;

export const useProfileStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
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
    // No longer using session storage, just reset to step 1
    setCurrentStep(1);
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