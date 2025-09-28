'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { ArrowLeft } from 'lucide-react';
import { InteractiveFollowCard } from '@/components/ui/InteractiveFollowCard';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import UptrendCanvas from '@/components/ui/UptrendCanvas';
import { NewsletterConnections } from '@/components/ui/NewsletterConnections';
import SignatureAnimation from '@/components/ui/SignatureAnimation';
import { AnimatedAudience } from '@/components/ui/AnimatedAudience';

const InnerProfileVerificationPage = () => {
  const searchParams = useSearchParams();
 
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
  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);
  const [resendResponseMessage, setResendResponseMessage] = useState<string | undefined>(undefined);

  // Check for name parameter in URL and auto-populate
  useEffect(() => {
    const nameParam = searchParams.get('name');
    if (nameParam) {
      const decodedName = decodeURIComponent(nameParam);
      setFormData(prev => ({ ...prev, name: decodedName }));
      setState(prev => ({ ...prev, first_name: decodedName }));
      // Skip to step 2 (email verification) if name is provided
      setCurrentStep(2);
      console.log('[Auto-populate] Name from URL:', decodedName, 'Skipping to step 2');
    }
  }, [searchParams, setState]);

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
      setInfoMessage(undefined); // Clear info message when going back from OTP
      setResendResponseMessage(undefined); // Clear resend response message when going back from OTP
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear messages when going back to any step
      setInfoMessage(undefined);
      setResendResponseMessage(undefined);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderCurrentStep = () => {
    console.log('renderCurrentStep called with currentStep:', currentStep);
    switch (currentStep) {
      case 1:
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
                  setResendResponseMessage(undefined);
                  console.log('[Step 4] Resending verification code', { email: state.email });
                  const res = await api.sendVerificationCode(state.email);
                  if (res.message) {
                    setResendResponseMessage(res.message);
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to resend';
                  setError(errorMessage);
                  setResendResponseMessage(errorMessage);
                } finally {
                  setLoading(false);
                }
              }}
              isLoading={loading}
              error={error}
              infoMessage={infoMessage}
              resendResponseMessage={resendResponseMessage}
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
                  const res = await api.sendVerificationCode(email);
                  // Expect res.code to be 'sent_email' or 'email_exists'
                  if (res.code === 'sent_email') {
                    setState(prev => ({ ...prev, email }));
                    setInfoMessage(res.message);
                    console.log('[Step 2] Email verified: code sent. Showing OTP step');
                    setShowCodeVerification(true);
                  } else if (res.code === 'email_exists') {
                    // Stay on same screen and show message
                    setError(undefined);
                    setInfoMessage(undefined);
                    setState(prev => ({ ...prev, email }));
                    console.log('[Step 2] Email exists. Staying on email screen with message');
                    const msg = res.message || 'Email already exists';
                    setError(msg);
                    alert(msg);
                  } else {
                    // Fallback: treat as error
                    const msg = res.message || 'Failed to send code';
                    setError(msg);
                    alert(msg);
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to send code';
                  setError(errorMessage);
                  alert(errorMessage);
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
      
      case 4:
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

  const getRightComponent = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 2.5:
        return <InteractiveFollowCard />;
      case 3:
      case 8:
       return <InteractiveMagazineCards />;
      case 6:
        return <AnimatedAudience />;
      case 4:
        return <NewsletterConnections />;
      case 5:
        return <InteractiveFollowCard />;
      case 7:
        return <UptrendCanvas />;
      case 9:
        return <SignatureAnimation />;
      case 10:
        return <InteractiveFollowCard />;
      default:
        return <InteractiveFollowCard />;
    }
  };

  const getRightImageStyle = () => {
    switch (currentStep) {
      case 6:
      case 7:
      case 8:
      case 9:
        return {
        background: 'radial-gradient(800px 600px at 15% 20%, rgba(229, 9, 20, 0.22), transparent 60%), radial-gradient(700px 500px at 85% 10%, rgba(229, 9, 20, 0.16), transparent 60%), linear-gradient(rgb(11, 11, 15) 0%, rgb(5, 5, 7) 100%)'
      };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Mobile Sidebar Toggle - Only show when sidebar is closed */}
      {!isMobileMenuOpen && (
        <MobileSidebarToggle onToggle={toggleMobileMenu} />
      )}

      {/* Section 1: Left Sidebar - Fixed position */}
      <div className="hidden xl:block flex-shrink-0">
        <Sidebar steps={steps} imageUrl={images.verifyPageLefBgImage}/>
      </div>

      {/* Mobile/Tablet Sidebar - Overlay */}
      <Sidebar 
        steps={steps} 
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Section 2: Middle Content - Scrollable */}
      <MainContent>
        {/* Scrollable Content with hidden scrollbar */}
        <div className="h-full overflow-y-auto scrollbar-hide">
          {/* Back Button - Top Left of MainContent */}
          {currentStep >= 2 && !isMobileMenuOpen && (
            <button
              type="button"
              aria-label="Go back"
              onClick={prevStep}
              className="flex gap-[5px] items-center mt-[10px] ml-[10px] cursor-pointer md:mt-[20px] md:ml-[80px]"
            >
              <ArrowLeft color="#000000" />
              <div className="font-outfit font-medium text-[#333333]">Back</div>
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
        </div>
      </MainContent>

      {/* Section 3: Right Image Section - Fixed position */}
      <div className="hidden xl:block flex-shrink-0">
        <RightImageSection
          className='h-full'
          style={getRightImageStyle()}
        >
          {getRightComponent()}
          </RightImageSection>
      </div>
    </div>
  );
};

const ProfileVerificationPage = () => (
  <OnboardingProvider>
    <Suspense fallback={<div>Loading...</div>}>
      <InnerProfileVerificationPage />
    </Suspense>
  </OnboardingProvider>
);

export default ProfileVerificationPage;
