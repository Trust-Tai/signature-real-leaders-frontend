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
import { toast } from '@/components/ui/toast';
import { InteractiveFollowCard } from '@/components/ui/InteractiveFollowCard';
// import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import UptrendCanvas from '@/components/ui/UptrendCanvas';
import { NewsletterConnections } from '@/components/ui/NewsletterConnections';
import SignatureAnimation from '@/components/ui/SignatureAnimation';
import { AnimatedAudience } from '@/components/ui/AnimatedAudience';
import AudienceAnimation from '@/components/ui/BrandHandleAnimation';

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

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed and current steps
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      
      // Special handling for step 1 (Claim) - reset email and verification state
      if (stepId === 1) {
        setState(prev => ({ ...prev, email: undefined }));
        setShowCodeVerification(false);
        setInfoMessage(undefined);
        setResendResponseMessage(undefined);
        setError(undefined);
        console.log(`Navigated to step ${stepId} - reset email and verification state`);
      }
      // Special handling for step 2 (Verification) - reset OTP state
      else if (stepId === 2) {
        setShowCodeVerification(false);
        setInfoMessage(undefined);
        setResendResponseMessage(undefined);
        setError(undefined);
        console.log(`Navigated to step ${stepId} - reset OTP state`);
      } else {
        console.log(`Navigated to step ${stepId}`);
      }
    }
  };

  const nextStep = () => {
    console.log('nextStep called, current step:', currentStep);
    if (currentStep < 10) {
      const newStep = currentStep + 1;
      console.log('Setting new step to:', newStep);
      setCurrentStep(newStep);
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
                    toast.warning(msg, { id: 'email-exists', autoClose: false });
                  } else {
                    // Fallback: treat as error
                    const msg = res.message || 'Failed to send code';
                    setError(msg);
                    toast.error(msg, { id: 'send-code-error', autoClose: false });
                  }
                } catch (e: unknown) {
              
                  const errorMessage = e instanceof Error ? e.message : 'Failed to send code';
                  setError(errorMessage);
                  toast.error(errorMessage, { id: 'send-code-exception', autoClose: false });
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
            initialData={{
              firstName: state.first_name || formData.name
            }}
            onSubmit={(data: {
              firstName: string;
              lastName: string;
              companyName: string;
              companyWebsite: string;
              industry: string;
              numberOfEmployees: string;
              contactEmailListSize: string;
              about: string;
              billing_address_1: string;
              billing_address_2: string;
              billing_city: string;
              billing_postcode: string;
              billing_country: string;
              billing_phone: string;
              brand_voice: string;
              unique_differentiation: string;
              top_pain_points: string;
              content_preference_industry: string[];
              primary_call_to_action: string;
              date_of_birth: string;
              occupation: string;
              profilePicture: string;
            }) => {
              setState(prev => ({
                ...prev,
                first_name: data.firstName,
                last_name: data.lastName,
                company_name: data.companyName,
                company_website: data.companyWebsite,
                industry: data.industry,
                num_employees: data.numberOfEmployees,
                email_list_size: data.contactEmailListSize,
                // Address Fields
                billing_address_1: data.billing_address_1,
                billing_address_2: data.billing_address_2,
                billing_city: data.billing_city,
                billing_postcode: data.billing_postcode,
                billing_country: data.billing_country,
                billing_phone: data.billing_phone,
                // Additional Fields
                brand_voice: data.brand_voice,
                unique_differentiation: data.unique_differentiation,
                top_pain_points: data.top_pain_points,
                content_preference_industry: data.content_preference_industry,
                primary_call_to_action: data.primary_call_to_action,
                date_of_birth: data.date_of_birth,
                occupation: data.occupation,
                profilePicture: data.profilePicture,
              }));
              console.log('[Step 3] Saved user information to state', { data });
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
            onSubmit={(descriptions) => {
              setState(prev => ({ ...prev, target_audience: descriptions }));
              console.log('[Step 6] Saved target audience', { descriptions });
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
            isSubmitting={loading}
            onSubmit={async (signData: { signature: string | null; confirmInfo: boolean; giveConsent: boolean; agreeTerms: boolean; uploadedImage: string | null; signatureFile: File | null; uploadedImageFile: File | null }) => {
              try {
                setLoading(true);
                setError(undefined);
                // Submit full user info
                const payload: Record<string, unknown> = {
                  firstName: state.first_name,
                  lastName: state.last_name,
                  email: state.email,
                  companyName: state.company_name,
                  companyWebsite: state.company_website,
                  industry: state.industry,
                  numEmployees: state.num_employees,
                  emailListSize: state.email_list_size,
                  newsletterService: state.newsletter?.service,
                  apiKey: state.newsletter?.api_key,
                  targetAudience: state.target_audience,
                  metrics: state.success_metrics,
                  profileTemplate: state.profile_template_id,
                  links: state.links || [],
                  consentFeatureName: signData.giveConsent,
                  agreeTerms: signData.agreeTerms,
                  confimInFoAccurate: signData.confirmInfo,
                  signature: signData.signature || signData.uploadedImage,
                  // Address Fields
                  billing_address_1: state.billing_address_1,
                  billing_address_2: state.billing_address_2,
                  billing_city: state.billing_city,
                  billing_postcode: state.billing_postcode,
                  billing_country: state.billing_country,
                  billing_phone: state.billing_phone,
                  // Additional Fields
                  brand_voice: state.brand_voice,
                  unique_differentiation: state.unique_differentiation,
                  top_pain_points: state.top_pain_points,
                  content_preference_industry: state.content_preference_industry,
                  primary_call_to_action: state.primary_call_to_action,
                  date_of_birth: state.date_of_birth,
                  occupation: state.occupation,
                  profilePicture: state.profilePicture,
                };
                if (!state.auth_token) throw new Error('Missing auth token');
                console.log('[Step 9] Submitting user info', { payload, hasAuthToken: !!state.auth_token });
                const submitRes = await api.submitUserInfo(state.auth_token, payload);
                if (submitRes?.success) {
                  const successMsg = submitRes.message || 'Your application has been submitted for review. You will be notified once it is approved.';
                  toast.success(successMsg, { id: 'submit-user-info-success' });
                  console.log('[Step 10] Submission complete. Moving to Review');
                  nextStep();
                  setLoading(false);
                  return;
                } else {
                  const failMsg = submitRes?.message || 'Submission failed';
                  setError(failMsg);
                  toast.error(failMsg, { id: 'submit-user-info-error' });
                  setLoading(false);
                  return;
                }
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Submission failed';
                setError(msg);
                toast.error(msg, { id: 'submit-user-info-exception' });
                console.error(e);
                setLoading(false);
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
        return <InteractiveFollowCard name={formData.name} />;
      case 3:
        return <AudienceAnimation />
      case 8:
        return <InteractiveFollowCard name={state.first_name || formData.name} />;
      //  return <InteractiveMagazineCards />;
      case 6:
        return <AnimatedAudience />;
      case 4:
        return <NewsletterConnections />;
      case 5:
        return <InteractiveFollowCard name={state.first_name || formData.name} />;
      case 7:
        return <UptrendCanvas />;
      case 9:
        return <SignatureAnimation />;
      case 10:
        return <InteractiveFollowCard name={state.first_name || formData.name} />;
      default:
        return <InteractiveFollowCard name={state.first_name || formData.name} />;
    }
  };

  const getRightImageStyle = () => {
    switch (currentStep) {
      case 3:
        return{
            background: `
          radial-gradient(800px 600px at 15% 20%, rgba(229,9,20,.22), transparent 60%),
          radial-gradient(700px 500px at 85% 10%, rgba(229,9,20,.16), transparent 60%),
          linear-gradient(180deg,#0b0b0f 0%, #050507 100%)
        `
        }
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
        <Sidebar steps={steps} imageUrl={images.verifyPageLefBgImage} onStepClick={handleStepClick}/>
      </div>

      {/* Mobile/Tablet Sidebar - Overlay */}
      <Sidebar 
        steps={steps} 
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
        onStepClick={handleStepClick}
      />

      {/* Section 2: Middle Content - Scrollable */}
      <MainContent>
        {/* Scrollable Content with hidden scrollbar */}
        <div className="h-full overflow-y-auto scrollbar-hide">
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
