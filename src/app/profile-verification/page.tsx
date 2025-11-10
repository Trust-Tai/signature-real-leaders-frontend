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
import { OnboardingProvider, useOnboarding } from '@/components/OnboardingContext';
import { api } from '@/lib/api';
import { images } from "../../assets/index";
import { toast } from '@/components/ui/toast';
import { InteractiveFollowCard } from '@/components/ui/InteractiveFollowCard';

const InnerProfileVerificationPage = () => {
 
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  
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
    { id: 3, title: 'Pending Review', status: currentStep === 3 ? 'current' : 'pending' }
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
    if (currentStep < 3) {
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
              console.log('[Social Callback] Account pending review, showing step 3...');
              // Move to pending review step
              setCurrentStep(3);
              // Clean up URL
              window.history.replaceState({}, document.title, '/profile-verification');
            } else {
              console.log('[Social Callback] Unknown status, showing step 3...');
              setCurrentStep(3);
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
    switch (currentStep) {
      case 1:
      case 2:
        return <InteractiveFollowCard name={state.first_name || 'John Doe'} />;
      case 3:
        return <InteractiveFollowCard name={state.first_name || 'John Doe'} />;
      default:
        return <InteractiveFollowCard name={state.first_name || 'John Doe'} />;
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
             {currentStep !== 3 && (
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
