'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { images } from '@/assets';
import OtpVerificationSection from '@/components/ui/OtpVerificationSection';
import SocialLoginButtons from '@/components/ui/SocialLoginButtons';
import ForgotEmailSection from '@/components/ui/ForgotEmailSection';
import { toast } from '@/components/ui/toast';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import { LoadingScreen } from '@/components';

const LoginPage = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'verify-otp' | 'forgot-email'>('signin');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    rememberMe: false,
  });

  // Check if user is already logged in
  React.useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userDataStr = localStorage.getItem('user_data');
        
        if (token && userDataStr) {
          const userData = JSON.parse(userDataStr);
          
          // Check if account is pending review
          if (userData.account_status === 'pending_review') {
            console.log('[Auth Check] Account pending review, redirecting to profile verification step 3');
            localStorage.setItem('redirect_to_step', '3');
            router.replace('/profile-verification');
            return;
          }
          
          // User is logged in and approved, redirect to dashboard
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Small delay to ensure localStorage is available
    const timeoutId = setTimeout(checkExistingAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  }, [otpValues]);

  const handleOtpPaste = useCallback((pastedData: string) => {
    // Check if pasted data is numeric and has 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtpValues(newOtp);
      
      // Focus on the last input
      const lastInput = document.getElementById('otp-5');
      lastInput?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      // If current box is empty and backspace is pressed, move to previous box
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  }, [otpValues]);

  const handleSendOTP = useCallback(async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setIsSubmitting(true);
      // API call to send verification code to email
      const res = await fetch('https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/login/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      
      // Show response in toast
      if (data?.success) {
        toast.success(data?.message || 'Verification code sent to your email');
        setCurrentScreen('verify-otp');
      } else {
        toast.error(data?.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Send OTP error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email]);

  const handleVerifyOTP = useCallback(async () => {
    const otpCode = otpValues.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch('https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/login/verify-code-and-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: parseInt(otpCode, 10)
        })
      });
      const data = await res.json();
      
      // Show response in toast
      if (data?.success) {
        // Store token and user data
        if (data?.token) {
          try { 
            localStorage.setItem('auth_token', data.token);
            if (data?.user) {
              localStorage.setItem('user_data', JSON.stringify(data.user));
            }
            if (data?.user_id) {
              localStorage.setItem('user_id', data.user_id.toString());
            }
            
            // Check account status before redirecting
            if (data?.user?.account_status === 'pending_review') {
              console.log('[OTP Verify] Account pending review, redirecting to profile verification step 3');
              localStorage.setItem('redirect_to_step', '3');
              router.replace('/profile-verification');
              return;
            }
            
            toast.success(data?.message || 'Login successful!');
            router.push('/dashboard');
          } catch (error) {
            console.error('Error storing auth data:', error);
          }
        }
      } else {
        toast.error(data?.message || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Verify OTP error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [otpValues, formData.email, router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (currentScreen === 'signin') {
      void handleSendOTP();
    } else if (currentScreen === 'verify-otp') {
      void handleVerifyOTP();
    }
  }, [currentScreen, handleSendOTP, handleVerifyOTP]);

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

      console.log('[Social Callback] URL Params:', {
        status,
        tempToken: tempToken ? 'present' : 'missing',
        message,
        accountStatus,
        isLoggedIn,
        userId
      });

      if (status === 'success' && tempToken) {
        try {
          setIsSubmitting(true);
          setIsCheckingAuth(false);
          
          console.log('[Social Callback] Processing successful auth...');
          console.log('[Social Callback] is_logged_in:', isLoggedIn);
          console.log('[Social Callback] account_status:', accountStatus);
          
          // Check if user is already logged in (existing user)
          if (isLoggedIn === '1') {
            console.log('[Social Callback] User is logged in, fetching permanent token...');
            
            // Get permanent token
            const { api } = await import('@/lib/api');
            const response = await api.getUserDetailsWithToken(tempToken);
            
            console.log('[Social Callback] API Response:', {
              success: response.success,
              hasToken: !!response.token,
              hasUser: !!response.user,
              accountStatus: response.user?.account_status
            });
            
            if (response.success && response.token) {
              localStorage.setItem('auth_token', response.token);
              localStorage.setItem('user_data', JSON.stringify(response.user));
              localStorage.setItem('user_id', response.user.id.toString());
              
              // Check account status
              if (response.user.account_status === 'pending_review') {
                console.log('[Social Callback] Account pending review, redirecting to profile verification step 3');
                localStorage.setItem('redirect_to_step', '3');
                router.replace('/profile-verification');
                return;
              }
              
              console.log('[Social Callback] Token stored, redirecting to dashboard...');
              toast.success(message || 'Login successful!');
              
              // Use replace instead of push to avoid back button issues
              router.replace('/dashboard');
            } else {
              console.error('[Social Callback] Invalid response from API');
              toast.error('Failed to complete login. Please try again.');
            }
          } else if (accountStatus === 'pending_review') {
            // New signup - account pending review
            console.log('[Social Callback] New signup - pending review, redirecting to profile verification step 3');
            
            // Store user data
            if (tempToken && userId) {
              localStorage.setItem('temp_auth_token', tempToken);
              localStorage.setItem('user_id', userId);
            }
            
            localStorage.setItem('redirect_to_step', '3');
            router.replace('/profile-verification');
          } else if (accountStatus === 'approved') {
            // Account approved but not logged in yet - fetch token
            console.log('[Social Callback] Account approved, fetching token...');
            
            const { api } = await import('@/lib/api');
            const response = await api.getUserDetailsWithToken(tempToken);
            
            if (response.success && response.token) {
              localStorage.setItem('auth_token', response.token);
              localStorage.setItem('user_data', JSON.stringify(response.user));
              localStorage.setItem('user_id', response.user.id.toString());
              
              toast.success(message || 'Login successful!');
              router.replace('/dashboard');
            }
          } else {
            console.log('[Social Callback] Account not approved');
            toast.error('Account not approved yet. Please wait for admin approval.');
            window.history.replaceState({}, document.title, '/login');
          }
        } catch (error) {
          console.error('[Social Callback] Error:', error);
          toast.error('Failed to complete authentication');
          window.history.replaceState({}, document.title, '/login');
        } finally {
          setIsSubmitting(false);
        }
      } else if (status === 'failed') {
        console.log('[Social Callback] Auth failed:', message);
        toast.error(message || 'Authentication failed');
        window.history.replaceState({}, document.title, '/login');
      }
    };

    void handleSocialCallback();
  }, [router]);

  // Social login handlers
  const handleGoogleLogin = useCallback(async () => {
    try {
      const { api } = await import('@/lib/api');
      const redirectUrl = `${window.location.origin}/login`;
      api.initiateGoogleAuth(redirectUrl);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  }, []);

  const handleAppleLogin = useCallback(async () => {
    try {
      // Implement Apple OAuth login
      toast.info('Apple login coming soon...');
    } catch {
      toast.error('Apple login failed');
    }
  }, []);

  const handleLinkedInLogin = useCallback(async () => {
    try {
      const { api } = await import('@/lib/api');
      const redirectUrl = `${window.location.origin}/login`;
      api.initiateLinkedInAuth(redirectUrl);
    } catch (error) {
      console.error('LinkedIn login error:', error);
      toast.error('LinkedIn login failed');
    }
  }, []);

  const SignInScreen = useMemo(() => (
    <>
      <div className="text-center mb-8">
        <h1 className="section-title mb-4" style={{color:"white"}}>Welcome back to RealLeaders</h1>
      </div>

      <div className="space-y-6">
    
        {/* Email Input */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-white" size={16} />
            <span className="text-sm font-medium text-white font-outfit">Email Address</span>
          </div>
          <div className="firstVerifyScreen mx-auto group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              placeholder="you@realleaders.com"
              required
            />
          </div>
        </div>

 <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-custom-red border-gray-300 rounded focus:ring-custom-red"
            />
            <span className="ml-2 text-sm text-white font-outfit">Remember me on this device</span>
          </label>
          <button
            type="button"
            onClick={() => setCurrentScreen('forgot-email')}
            className="text-sm text-custom-red hover:text-red-600 transition-colors font-outfit"
          >
            Forgot email?
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-custom-red hover:bg-custom-red/90 disabled:bg-custom-red/70 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Sending OTP...
            </>
          ) : (
            'Login'
          )}
        </button>
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-white font-outfit">Or continue with Social Login</span>
          </div>
        </div>

            {/* Social Login Buttons */}
<div className="space-y-4">
          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            onLinkedInLogin={handleLinkedInLogin}
            isLoading={isSubmitting}
          />
        </div>
       
      </div>
    </>
  ), [formData, handleInputChange, handleSubmit, isSubmitting, handleGoogleLogin, handleAppleLogin, handleLinkedInLogin]);

  const VerifyOtpScreen = useMemo(() => (
    <OtpVerificationSection
      otpValues={otpValues}
      handleOtpChange={handleOtpChange}
      handleOtpPaste={handleOtpPaste}
      handleOtpKeyDown={handleOtpKeyDown}
      handleSubmit={handleSubmit}
      onBack={() => setCurrentScreen('signin')}
      isSubmitting={isSubmitting}
    />
  ), [otpValues, handleOtpChange, handleOtpPaste, handleOtpKeyDown, handleSubmit, isSubmitting]);

  const ForgotEmailScreen = useMemo(() => (
    <ForgotEmailSection
      onBack={() => setCurrentScreen('signin')}
    />
  ), []);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return SignInScreen;
      case 'verify-otp':
        return VerifyOtpScreen;
      case 'forgot-email':
        return ForgotEmailScreen;
      default:
        return SignInScreen;
    }
  };

  // Show loading only while checking authentication (not for isSubmitting)
  if (isCheckingAuth) {
    return (
      <LoadingScreen text1='Checking authentication...'/>
    );
  }

  return (
    <div className="h-screen lg:min-h-screen bg-gray-800 flex items-center justify-center p-0 sm:p-4" style={{background:"#f9efef"}}>
      <div className="flex flex-col lg:flex-row w-full h-full lg:max-w-6xl lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:min-h-[700px]">
        <div className="w-full h-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 relative flex flex-col justify-center" style={{background:"black"}}>
          <div className="text-center mb-6 lg:mb-8 flex justify-center">
            <Image src={images.realLeaders} alt='' className="realLeadersLogo" />
          </div>
          {renderCurrentScreen()}
        </div>
        <div className="hidden lg:block w-1/2 h-auto">
  <InteractiveMagazineCards />
</div>
      </div>
    </div>
  );
};

export default LoginPage;


