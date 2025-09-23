'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  ClaimSection,
  EmailVerificationSection,
  CodeVerificationSection,
  InformationFormSection,
  NewsletterSetupSection,
  ProfileTemplateSection,
  AudienceDescriptionSection,
  SuccessMetricsSection,
  LinksSection,
  SignSection,
  VerificationReviewSection,
  Step,
  MobileSidebarToggle
} from '@/components';
import { OnboardingProvider, useOnboarding } from '@/components/OnboardingContext';
import { api } from '@/lib/api';
import { images } from "../../assets/index";

const InnerProfileVerificationPage = () => {
 
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  
  // Form data state for all steps
  const { state, setState } = useOnboarding();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Verification', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, title: 'Your Information', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, title: 'Newsletter Setup', status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending' },
    { id: 5, title: 'Profile Template', status: currentStep === 5 ? 'current' : currentStep > 5 ? 'completed' : 'pending' },
    { id: 6, title: 'Your Audience', status: currentStep === 6 ? 'current' : currentStep > 6 ? 'completed' : 'pending' },
    { id: 7, title: 'Your Success Metrics', status: currentStep === 7 ? 'current' : currentStep > 7 ? 'completed' : 'pending' },
    { id: 8, title: 'Your Links', status: currentStep === 8 ? 'current' : currentStep > 8 ? 'completed' : 'pending' },
    { id: 9, title: 'Sign', status: currentStep === 9 ? 'current' : currentStep > 9 ? 'completed' : 'pending' },
    { id: 10, title: 'Review in Progress', status: currentStep === 10 ? 'current' : 'pending' }
  ];

  const nextStep = () => {
    console.log('nextStep called, current step:', currentStep);
    if (currentStep < 10) {
      const newStep = currentStep + 1;
      console.log('Setting new step to:', newStep);
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep === 2 && showCodeVerification) {
      setShowCodeVerification(false);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderCurrentStep = () => {
    console.log('renderCurrentStep called with currentStep:', currentStep);
    switch (currentStep) {
      case 4:
        return (
          <ClaimSection
            title="CLAIM YOUR SIGNATURE"
            placeholder="Enter your name..."
            value={formData.name}
            onChange={(name) => setFormData(prev => ({ ...prev, name }))}
            onVerify={(name) => {
              console.log('Verifying name:', name);
              console.log('Current step before next:', currentStep);
              if (name !== "") {
                nextStep();
                console.log('Moving to next step');
              }
            }}
            buttonText="VERIFY"
          />
        );
      
      case 2:
        if (showCodeVerification) {
          return (
            <CodeVerificationSection
              onVerify={async (code) => {
                try {
                  if (!state.email) return;
                  setLoading(true);
                  setError(undefined);
                
                  console.log('[Step 3] Verifying code with email', { email: state.email, code });
                  const res = await api.verifyCode(state.email, code);
                  if (res.success && res.auth_token) {
                    setState(prev => ({ ...prev, auth_token: res.auth_token }));
                    console.log('[Step 3] Verified. Saved auth_token and moving to next step');
                    nextStep();
                  } else {
                    setError(res.message || 'Invalid code');
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Verification failed';
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
              onResendCode={async () => {
                try {
                  if (!state.email) return;
                  setLoading(true);
                  setError(undefined);
                  console.log('[Step 4] Resending verification code', { email: state.email });
                  await api.sendVerificationCode(state.email);
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to resend';
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
              isLoading={loading}
              error={error}
            />
          );
        } else {
          return (
            <EmailVerificationSection
              onSendCode={async (email) => {
                try {
                  setLoading(true);
                  setError(undefined);
                  console.log('[Step 2] Sending verification code', { email });
                  await api.sendVerificationCode(email);
                  setState(prev => ({ ...prev, email }));
                  console.log('[Step 2] Saved email to state, showing OTP step');
                  setShowCodeVerification(true);
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to send code';
                  setError(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
              error={error}
              isLoading={loading}
            />
          );
        }
      
      case 3:
        return (
          <InformationFormSection
            onSubmit={(data: { firstName: string; lastName: string; companyName: string; companyWebsite: string; industry: string; numberOfEmployees: string; contactEmailListSize: string; about: string }) => {
              setState(prev => ({
                ...prev,
                first_name: data.firstName,
                last_name: data.lastName,
                company_name: data.companyName,
                company_website: data.companyWebsite,
                industry: data.industry,
                num_employees: data.numberOfEmployees,
                email_list_size: data.contactEmailListSize,
                audience_description: data.about,
              }));
              console.log('[Step 5] Saved user information to state', { data });
              nextStep();
            }}
          />
        );
      
      case 1:
        return (
          <NewsletterSetupSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 5:
        return (
          <ProfileTemplateSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 6:
        return (
          <AudienceDescriptionSection
            onSubmit={(description) => {
              setState(prev => ({ ...prev, audience_description: description }));
              console.log('[Step 8] Saved audience description', { description });
              nextStep();
            }}
          />
        );
      
      case 7:
        return (
          <SuccessMetricsSection
            onSubmit={(data: { numberOfBookings: string; emailListSize: string; amountInSales: string; amountInDonations: string }) => {
              setState(prev => ({ ...prev, success_metrics: data }));
              console.log('[Step 8] Saved success metrics', { data });
              nextStep();
            }}
          />
        );
      
      case 8:
        return (
          <LinksSection
            onSubmit={(links) => {
              setState(prev => ({ ...prev, links }));
              console.log('[Step 9] Saved links', { links });
              nextStep();
            }}
          />
        );
      
      case 9:
        return (
          <SignSection
            onSubmit={async (signData: { signature: string | null; confirmInfo: boolean; giveConsent: boolean; agreeTerms: boolean; uploadedImage: string | null; signatureFile: File | null; uploadedImageFile: File | null }) => {
              try {
                // Submit full user info
                const payload: Record<string, unknown> = {
                  first_name: state.first_name,
                  last_name: state.last_name,
                  email: state.email,
                  company_name: state.company_name,
                  company_website: state.company_website,
                  industry: state.industry,
                  num_employees: state.num_employees,
                  email_list_size: state.email_list_size,
                  newsletter_service: state.newsletter?.service,
                  apiKey: state.newsletter?.api_key,
                  audience_description: state.audience_description,
                  success_metrics: state.success_metrics,
                  profile_template_id: state.profile_template_id,
                  links: state.links || [],
                  consentFeatureName: signData.giveConsent,
                  agreeTerms: signData.agreeTerms,
                  confimInFoAccurate: signData.confirmInfo,
                  signature: signData.signature || signData.uploadedImage,
                };
                if (!state.auth_token) throw new Error('Missing auth token');
                console.log('[Step 9] Submitting user info', { payload, hasAuthToken: !!state.auth_token });
                await api.submitUserInfo(state.auth_token, payload);

                // Upload signature image - prioritize uploaded image, fallback to drawn signature
                let signatureFile = null;
                if (signData.uploadedImageFile) {
                  signatureFile = signData.uploadedImageFile;
                  console.log('[Step 9] Uploading uploaded image file as signature', { 
                    fileName: signatureFile.name, 
                    fileSize: signatureFile.size,
                    consent: !!signData.giveConsent 
                  });
                } else if (signData.signatureFile) {
                  signatureFile = signData.signatureFile;
                  console.log('[Step 9] Uploading drawn signature file', { 
                    fileName: signatureFile.name, 
                    fileSize: signatureFile.size,
                    consent: !!signData.giveConsent 
                  });
                }

                if (signatureFile) {
                  await api.uploadSignature(state.auth_token, signatureFile, !!signData.giveConsent);
                } else {
                  console.warn('[Step 9] No signature file available to upload');
                }

                console.log('[Step 10] Submission complete. Moving to Review');
                nextStep();
              } catch (e) {
                console.error(e);
              }
            }}
          />
        );
      
      case 10:
        return (
          <VerificationReviewSection
          />
        );
      
      default:
        return (
          <ClaimSection
            title="CLAIM YOUR SIGNATURE"
            placeholder="Enter your name..."
            onVerify={(name) => {
              console.log('Verifying name:', name);
              if (name !== "") {
                nextStep();
              }
            }}
            buttonText="VERIFY"
          />
        );
    }
  };

  const getRightImage = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 2.5:
        return images.verifyFirstPageRightBgImage;
      case 3:
      case 6:
        return images.comboInfoAudSideBarImage;
      case 4:
        return images.verifyFirstPageRightBgImage;
      case 5:
        return images.verifyFirstPageRightBgImage;
      case 7:
        return images.successMetrixRightSideImage;
      case 8:
        return images.linkRightSideImge;
      case 9:
        return images.signRightImage;
      case 10:
        return images.verifyFirstPageRightBgImage;
      default:
        return images.verifyFirstPageRightBgImage;
    }
  };

  const getRightImageStyle = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 2.5:
      case 4:
      case 5:
      case 10:
        return {
          background: 'linear-gradient(180deg, #1C92D2 0%, #F2FCFE 100%)'
        };
      case 3:
      case 6:
        return {
          background: 'linear-gradient(180deg, #4AC29A 0%, #BDFFF3 100%)'
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
      {/* Mobile Sidebar Toggle - Only show when sidebar is closed */}
      {!isMobileMenuOpen && (
        <MobileSidebarToggle onToggle={toggleMobileMenu} />
      )}

      {/* Section 1: Left Sidebar - Hidden on mobile/tablet, shown on desktop */}
      <div className="">
        <Sidebar steps={steps} imageUrl={images.verifyPageLefBgImage}/>
      </div>

      {/* Mobile/Tablet Sidebar - Overlay */}
      <Sidebar 
        steps={steps} 
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Section 2: Middle Content - Takes remaining width */}
      <MainContent>
        {/* Back Button - Top Left of MainContent */}
        {currentStep >= 2 && (
          <button
            type="button"
            aria-label="Go back"
            onClick={prevStep}
            className="absolute top-4 left-4 z-50 p-2 inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
          >
            <span className="h-5 w-5 inline-block" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#33333]">Back</span>
          </button>
        )}

        <div className="flex items-start justify-center min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
          <div className={`w-full mt-16 sm:mt-20 lg:mt-[40px] ${
            currentStep === 3 || currentStep === 7 || currentStep === 5? 'max-w-[870px]' : 'max-w-2xl'
          }`}>
            {/* Header */}
           {currentStep !== 10 && (
  <PageHeader
    title="MAKE YOUR MARK"
    subtitle="with RealLeaders signature"
    highlightWord="MARK"
    className={`lg:mb-[${currentStep === 1 ? '150px' : currentStep === 3 ? '80px' : currentStep === 5 ? '60px' : currentStep === 6 ? '100px' : currentStep === 7 ? '130px' : '90px'}]`}
  />
)}


            {/* Current Step Component */}
            {renderCurrentStep()}
          </div>
        </div>
      </MainContent>

      {/* Section 3: Right Image Section - Hidden on mobile/tablet, shown on desktop */}
      <RightImageSection
        imageUrl={getRightImage()}
        className='h-full'
        style={getRightImageStyle()}
      />
    </div>
  );
};

const ProfileVerificationPage = () => (
  <OnboardingProvider>
    <InnerProfileVerificationPage />
  </OnboardingProvider>
);

export default ProfileVerificationPage;
