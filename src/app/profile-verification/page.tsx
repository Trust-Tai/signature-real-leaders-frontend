'use client';

import React, { useState, Suspense } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  SimplifiedEmailVerificationSection,
  CodeVerificationSection,
  PendingReviewSection,
  Step,
  MobileSidebarToggle,
  LoadingScreen
} from '@/components';
import InformationFormSection from '@/components/ui/InformationFormSection';
import SignSection from '@/components/ui/SignSection';
import { OnboardingProvider, useOnboarding } from '@/components/OnboardingContext';
import { api } from '@/lib/api';
import { images } from "../../assets/index";
import { toast } from '@/components/ui/toast';
import { InteractiveFollowCard } from '@/components/ui/InteractiveFollowCard';

const InnerProfileVerificationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  
  // Check localStorage for redirect step on mount and when page becomes visible
  React.useEffect(() => {
    const checkRedirectStep = () => {
      if (typeof window !== 'undefined') {
        const redirectStep = localStorage.getItem('redirect_to_step');
        if (redirectStep) {
          console.log('[Profile Verification] Found redirect_to_step:', redirectStep);
          const step = parseInt(redirectStep, 10);
          setCurrentStep(step);
          localStorage.removeItem('redirect_to_step'); // Clear after reading
        }
      }
    };
    
    // Check immediately on mount
    checkRedirectStep();
    
    // Also check when page becomes visible (in case of navigation)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkRedirectStep();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Form data state for simplified flow
  const { state, setState } = useOnboarding();
  const [loading, setLoading] = useState(false); // For social login callback
  const [sendingCode, setSendingCode] = useState(false); // For email verification
  const [error, setError] = useState<string | undefined>(undefined);
  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);
  const [resendResponseMessage, setResendResponseMessage] = useState<string | undefined>(undefined);

  const steps: Step[] = [
    { id: 1, title: 'Email Verification', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Code Verification', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, title: 'Information', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, title: 'Signature', status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending' },
    { id: 5, title: 'Pending Review', status: currentStep === 5 ? 'current' : 'pending' }
  ];

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed and current steps
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
      
      // Special handling for step 1 (Email) - reset email and verification state
      if (stepId === 1) {
        setState(prev => ({ ...prev, email: undefined }));
        setShowCodeVerification(false);
        setInfoMessage(undefined);
        setResendResponseMessage(undefined);
        setError(undefined);
        console.log(`Navigated to step ${stepId} - reset email and verification state`);
      }
      // Special handling for step 2 (Code Verification) - reset OTP state
      else if (stepId === 2) {
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
    if (currentStep < 5) {
      const newStep = currentStep + 1;
      console.log('Setting new step to:', newStep);
      setCurrentStep(newStep);
    }
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle Google/LinkedIn OAuth callback
  React.useEffect(() => {
    const handleSocialCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const tempToken = urlParams.get('token');
      const message = urlParams.get('message');
      const accountStatus = urlParams.get('account_status');
      const isLoggedIn = urlParams.get('is_logged_in');
      const userId = urlParams.get('user_id');

      console.log('[Social Callback - Profile Verification] URL Params:', {
        status,
        tempToken: tempToken ? 'present' : 'missing',
        message,
        accountStatus,
        isLoggedIn,
        userId
      });

      if (status === 'success' && tempToken) {
        try {
          setLoading(true);
          
          console.log('[Social Callback] Processing successful auth...');
          console.log('[Social Callback] is_logged_in:', isLoggedIn);
          console.log('[Social Callback] account_status:', accountStatus);
          
          // Get permanent token
          const response = await api.getUserDetailsWithToken(tempToken);
          
          console.log('[Social Callback] API Response:', {
            success: response.success,
            hasToken: !!response.token,
            hasUser: !!response.user,
            accountStatus: response.user?.account_status
          });
          
          if (response.success && response.token) {
            setState(prev => ({ 
              ...prev, 
              email: response.user.email,
              auth_token: response.token,
              first_name: response.user.first_name,
              last_name: response.user.last_name
            }));
            
            // Store in localStorage
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
            localStorage.setItem('user_id', response.user.id.toString());
            
            toast.success(message || 'Authentication successful!');
            
            // Check account status and redirect accordingly
            if (response.user.account_status === 'approved' || isLoggedIn === '1') {
              console.log('[Social Callback] Account approved, redirecting to dashboard...');
              // Use window.location for hard redirect to ensure dashboard loads properly
              window.location.href = '/dashboard';
            } else if (response.user.account_status === 'pending_review' || accountStatus === 'pending_review') {
              console.log('[Social Callback] Account pending review, staying on current step...');
              // Show toast message and stay on current step
              toast.info('Your account is pending review. Please wait for admin approval.', { autoClose: 4000 });
              // Clean up URL
              window.history.replaceState({}, document.title, '/profile-verification');
            } else {
              console.log('[Social Callback] Unknown status, staying on current step...');
              // Stay on current step for unknown status
              toast.info('Your account is pending review. Please wait for admin approval.', { autoClose: 4000 });
              window.history.replaceState({}, document.title, '/profile-verification');
            }
          }
        } catch (error) {
          console.error('[Social Callback] Error:', error);
          const errorMsg = error instanceof Error ? error.message : 'Failed to complete authentication';
          setError(errorMsg);
          toast.error(errorMsg);
          window.history.replaceState({}, document.title, '/profile-verification');
        } finally {
          setLoading(false);
        }
      } else if (status === 'failed') {
        console.log('[Social Callback] Auth failed:', message);
        toast.error(message || 'Authentication failed');
        window.history.replaceState({}, document.title, '/profile-verification');
      }
    };

    void handleSocialCallback();
  }, [setState]);

  // Social login handlers
  const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      setError(undefined);
      console.log(`[Social Login] Attempting ${provider} login`);
      
      if (provider === 'google') {
        const redirectUrl = `${window.location.origin}/profile-verification`;
        api.initiateGoogleAuth(redirectUrl);
        // Don't set loading here - it will redirect to Google
      } else if (provider === 'linkedin') {
        const redirectUrl = `${window.location.origin}/profile-verification`;
        api.initiateLinkedInAuth(redirectUrl);
        // Don't set loading here - it will redirect to LinkedIn
      } else {
        // Apple coming soon
        toast.info(`${provider} login will be implemented soon`, { id: 'social-login-info' });
      }
      
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : `${provider} login failed`;
      setError(errorMessage);
      toast.error(errorMessage, { id: 'social-login-error' });
    }
  };

  const renderCurrentStep = () => {
    console.log('renderCurrentStep called with currentStep:', currentStep);
    switch (currentStep) {
      case 1:
        if (showCodeVerification) {
          return (
            <CodeVerificationSection
              onVerify={async (code) => {
                try {
                  if (!state.email) return;
                  setSendingCode(true);
                  setError(undefined);
                
                  console.log('[Step 2] Verifying code with email', { email: state.email, code });
                  const res = await api.verifyCode(state.email, code);
                
                  if (res.success && res.auth_token) {
                    setState(prev => ({ ...prev, auth_token: res.auth_token }));
                    console.log('[Step 2] Verified. Moving to pending review');
                    nextStep();
                  } else {
                    setError(res.message || 'Invalid code');
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Verification failed';
                  setError(errorMessage);
                } finally {
                  setSendingCode(false);
                }
              }}
              onResendCode={async () => {
                try {
                  if (!state.email) return;
                  setSendingCode(true);
                  setError(undefined);
                  setResendResponseMessage(undefined);
                  console.log('[Step 2] Resending verification code', { email: state.email });
                  const res = await api.sendVerificationCode(state.email);
                  if (res.message) {
                    setResendResponseMessage(res.message);
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to resend';
                  setError(errorMessage);
                  setResendResponseMessage(errorMessage);
                } finally {
                  setSendingCode(false);
                }
              }}
              isLoading={sendingCode}
              error={error}
              infoMessage={infoMessage}
              resendResponseMessage={resendResponseMessage}
            />
          );
        } else {
          return (
            <SimplifiedEmailVerificationSection
              onSendCode={async (email) => {
                try {
                  setSendingCode(true);
                  setError(undefined);
                  console.log('[Step 1] Sending verification code', { email });
                  const res = await api.sendVerificationCode(email);
                 
                  // Expect res.code to be 'sent_email' or 'email_exists'
                  if (res.code === 'sent_email') {
                    setState(prev => ({ ...prev, email }));
                    setInfoMessage(res.message);
                    console.log('[Step 1] Email verified: code sent. Showing OTP step');
                    setShowCodeVerification(true);
                    setCurrentStep(2);
                  } else if (res.code === 'email_exists') {
                    // Stay on same screen and show message
                    setError(undefined);
                    setInfoMessage(undefined);
                    setState(prev => ({ ...prev, email }));
                    console.log('[Step 1] Email exists. Staying on email screen with message');
                    const msg = res.message || 'Email already exists';
                    setError(msg);
                    toast.warning(msg, { id: 'email-exists' });
                  } else {
                    // Fallback: treat as error
                    const msg = res.message || 'Failed to send code';
                    setError(msg);
                    toast.error(msg, { id: 'send-code-error' });
                  }
                } catch (e: unknown) {
                  const errorMessage = e instanceof Error ? e.message : 'Failed to send code';
                  setError(errorMessage);
                  toast.error(errorMessage, { id: 'send-code-exception'});
                } finally {
                  setSendingCode(false);
                }
              }}
              onGoogleLogin={() => handleSocialLogin('google')}
              onAppleLogin={() => handleSocialLogin('apple')}
              onLinkedInLogin={() => handleSocialLogin('linkedin')}
              error={error}
              isLoading={sendingCode}
            />
          );
        }
      
      case 2:
        return (
          <CodeVerificationSection
            onVerify={async (code) => {
              try {
                if (!state.email) return;
                setSendingCode(true);
                setError(undefined);
              
                console.log('[Step 2] Verifying code with email', { email: state.email, code });
                const res = await api.verifyCode(state.email, code);
              
                if (res.success && res.auth_token) {
                  setState(prev => ({ ...prev, auth_token: res.auth_token }));
                  console.log('[Step 2] Verified. Moving to pending review');
                  nextStep();
                } else {
                  setError(res.message || 'Invalid code');
                }
              } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : 'Verification failed';
                setError(errorMessage);
              } finally {
                setSendingCode(false);
              }
            }}
            onResendCode={async () => {
              try {
                if (!state.email) return;
                setSendingCode(true);
                setError(undefined);
                setResendResponseMessage(undefined);
                console.log('[Step 2] Resending verification code', { email: state.email });
                const res = await api.sendVerificationCode(state.email);
                if (res.message) {
                  setResendResponseMessage(res.message);
                }
              } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : 'Failed to resend';
                setError(errorMessage);
                setResendResponseMessage(errorMessage);
              } finally {
                setSendingCode(false);
              }
            }}
            isLoading={sendingCode}
            error={error}
            infoMessage={infoMessage}
            resendResponseMessage={resendResponseMessage}
          />
        );
      
      case 3:
        return (
          <InformationFormSection
            onBack={() => {
              console.log('[Step 3] Going back to step 1');
              setCurrentStep(1);
              setShowCodeVerification(false);
            }}
            onSubmit={(data) => {
              console.log('[Step 3] Information form data received, moving to signature step');
              
              // Store all form data in context
              setState(prev => ({
                ...prev,
                first_name: data.firstName,
                last_name: data.lastName,
                company_name: data.companyName,
                company_website: data.companyWebsite,
                industry: data.industry,
                num_employees: data.numberOfEmployees,
                about: data.about,
                occupation: data.occupation,
                profilePicture: data.profilePicture,
                phone: data.phone
              }));
              
              // Move to signature step
              nextStep();
            }}
            initialData={{
              firstName: state.first_name,
              lastName: state.last_name
            }}
          />
        );
      
      case 4:
        return (
          <SignSection
            onBack={() => setCurrentStep(3)}
            onSubmit={async (signData) => {
                try {
                  console.log('[Step 4] Submitting all data to API...');
                  setLoading(true);
                  
                  const authToken = state.auth_token || localStorage.getItem('auth_token');
                  if (!authToken) {
                    toast.error('Authentication token missing. Please login again.');
                    return;
                  }

                  // Prepare FormData for file upload
                  const formData = new FormData();
                  
                  // Add all text fields
                  if (state.first_name) formData.append('firstName', state.first_name);
                  if (state.last_name) formData.append('lastName', state.last_name);
                  if (state.email) formData.append('email', state.email);
                  if (state.company_name) formData.append('companyName', state.company_name);
                  if (state.company_website) formData.append('companyWebsite', state.company_website);
                  if (state.industry) formData.append('industry', state.industry);
                  if (state.num_employees) formData.append('numEmployees', state.num_employees);
                  if (state.about) formData.append('about', state.about);
                  if (state.occupation) formData.append('occupation', state.occupation);
                  if (state.phone) formData.append('phone', state.phone);
                  
                  // Add signature - prioritize file objects over data URLs
                  console.log('[Step 4] Signature data:', {
                    hasSignatureFile: !!signData.signatureFile,
                    hasUploadedImageFile: !!signData.uploadedImageFile,
                    hasSignature: !!signData.signature,
                    hasUploadedImage: !!signData.uploadedImage
                  });
                  
                  let signatureAdded = false;
                  
                  if (signData.signatureFile) {
                    console.log('[Step 4] Adding signatureFile to FormData:', {
                      name: signData.signatureFile.name,
                      size: signData.signatureFile.size,
                      type: signData.signatureFile.type
                    });
                    formData.append('signature', signData.signatureFile, 'signature.png');
                    signatureAdded = true;
                  } else if (signData.uploadedImageFile) {
                    console.log('[Step 4] Adding uploadedImageFile to FormData:', {
                      name: signData.uploadedImageFile.name,
                      size: signData.uploadedImageFile.size,
                      type: signData.uploadedImageFile.type
                    });
                    formData.append('signature', signData.uploadedImageFile, signData.uploadedImageFile.name);
                    signatureAdded = true;
                  } else if (signData.signature) {
                    console.log('[Step 4] Converting signature data URL to File');
                    const signatureResponse = await fetch(signData.signature);
                    const signatureBlob = await signatureResponse.blob();
                    const signatureFile = new File([signatureBlob], 'signature.png', { type: 'image/png' });
                    console.log('[Step 4] Converted signature file:', {
                      name: signatureFile.name,
                      size: signatureFile.size,
                      type: signatureFile.type
                    });
                    formData.append('signature', signatureFile, 'signature.png');
                    signatureAdded = true;
                  } else if (signData.uploadedImage) {
                    console.log('[Step 4] Converting uploaded image data URL to File');
                    const response = await fetch(signData.uploadedImage);
                    const blob = await response.blob();
                    const file = new File([blob], 'uploaded-signature.png', { type: 'image/png' });
                    console.log('[Step 4] Converted uploaded image file:', {
                      name: file.name,
                      size: file.size,
                      type: file.type
                    });
                    formData.append('signature', file, 'uploaded-signature.png');
                    signatureAdded = true;
                  }
                  
                  if (!signatureAdded) {
                    console.error('[Step 4] No signature data found!');
                    toast.error('Please add your signature before submitting.');
                    setLoading(false);
                    return;
                  }
                  
                  console.log('[Step 4] Signature successfully added to FormData');
                  
                  // Consent fields (required by API)
                  formData.append('consentFeatureName', signData.giveConsent ? 'true' : 'false');
                  formData.append('agreeTerms', signData.agreeTerms ? 'true' : 'false');
                  formData.append('confimInFoAccurate', signData.confirmInfo ? 'true' : 'false');
                  
                  // Add profile picture if exists
                  if (state.profilePicture) {
                    const response = await fetch(state.profilePicture);
                    const blob = await response.blob();
                    const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
                    formData.append('profilePicture', file);
                  } else {
                    formData.append('profilePicture', '');
                  }

                  console.log('[Step 4] Submitting to API...');
                  
                  // Log FormData contents for debugging
                  console.log('[Step 4] FormData contents:');
                  let hasSignatureInFormData = false;
                  for (const [key, value] of formData.entries()) {
                    if (key === 'signature') {
                      hasSignatureInFormData = true;
                      console.log(`  ✅ ${key}: File(${value instanceof File ? value.name : 'unknown'}, ${value instanceof File ? value.size : 0} bytes, ${value instanceof File ? value.type : 'unknown'})`);
                    } else if (value instanceof File) {
                      console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
                    } else {
                      console.log(`  ${key}: ${value}`);
                    }
                  }
                  
                  if (!hasSignatureInFormData) {
                    console.error('[Step 4] ❌ CRITICAL: Signature NOT found in FormData!');
                    toast.error('Signature missing from form data. Please try again.');
                    setLoading(false);
                    return;
                  }
                  
                  console.log('[Step 4] ✅ Signature confirmed in FormData');
                  
                  // Call API with FormData
                  const result = await api.submitUserInfoWithFiles(authToken, formData);
                  
                  if (result.success) {
                    console.log('[Step 4] Submission successful!');
                    toast.success('Profile submitted successfully! Awaiting admin review.');
                    nextStep(); // Move to pending review (step 5)
                  } else {
                    toast.error(result.message || 'Submission failed. Please try again.');
                  }
                } catch (error) {
                  console.error('[Step 4] Submission error:', error);
                  toast.error('Failed to submit profile. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              isSubmitting={loading}
            />
        );
      
      case 5:
        return <PendingReviewSection />;
      
      default:
        return (
          <SimplifiedEmailVerificationSection
            onSendCode={async (email) => {
              try {
                setSendingCode(true);
                setError(undefined);
                console.log('[Step 1] Sending verification code', { email });
                const res = await api.sendVerificationCode(email);
               
                if (res.code === 'sent_email') {
                  setState(prev => ({ ...prev, email }));
                  setInfoMessage(res.message);
                  console.log('[Step 1] Email verified: code sent. Showing OTP step');
                  setShowCodeVerification(true);
                  setCurrentStep(2);
                } else if (res.code === 'email_exists') {
                  setError(undefined);
                  setInfoMessage(undefined);
                  setState(prev => ({ ...prev, email }));
                  const msg = res.message || 'Email already exists';
                  setError(msg);
                  toast.warning(msg, { id: 'email-exists' });
                } else {
                  const msg = res.message || 'Failed to send code';
                  setError(msg);
                  toast.error(msg, { id: 'send-code-error' });
                }
              } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : 'Failed to send code';
                setError(errorMessage);
                toast.error(errorMessage, { id: 'send-code-exception'});
              } finally {
                setSendingCode(false);
              }
            }}
            onGoogleLogin={() => handleSocialLogin('google')}
            onAppleLogin={() => handleSocialLogin('apple')}
            onLinkedInLogin={() => handleSocialLogin('linkedin')}
            error={error}
            isLoading={sendingCode}
          />
        );
    }
  };

  const getRightComponent = () => {
    // Combine first and last name for display
    const fullName = [state.first_name, state.last_name]
      .filter(Boolean)
      .join(' ')
      .trim() || 'John Doe';
    
    switch (currentStep) {
      case 1:
      case 2:
        return <InteractiveFollowCard name={fullName} />;
      case 3:
      case 4:
        return <InteractiveFollowCard name={fullName} />;
      default:
        return <InteractiveFollowCard name={fullName} />;
    }
  };

  const getRightImageStyle = () => {
    // Use default styling for all steps in simplified flow
    return {};
  };

  // Show loading overlay when processing social login callback
  if (loading) {
    return (
      <LoadingScreen text1='Processing authentication...'/>
    );
  }

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

            <div className={`w-full mt-16 sm:mt-20 lg:mt-[40px] max-w-2xl`}>
              {/* Header */}
             {currentStep !== 5 && (
    <PageHeader
      title="MAKE YOUR MARK"
      subtitle="with RealLeaders signature"
      highlightWord="MARK"
      className="lg:mb-[90px]"
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
