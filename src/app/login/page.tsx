// 'use client'
// import React, { useState, useCallback, useMemo } from 'react';
// import { Mail } from 'lucide-react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { images } from '@/assets';
// import OtpVerificationSection from '@/components/ui/OtpVerificationSection';
// import SocialLoginButtons from '@/components/ui/SocialLoginButtons';
// import ForgotEmailSection from '@/components/ui/ForgotEmailSection';
// import { toast } from '@/components/ui/toast';
// import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
// import { LoadingScreen } from '@/components';

// const LoginPage = () => {
//   const router = useRouter();
//   const [currentScreen, setCurrentScreen] = useState<'signin' | 'verify-otp' | 'forgot-email'>('signin');
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     rememberMe: false,
//   });

//   // Check if user is already logged in
//   React.useEffect(() => {
//     const checkExistingAuth = () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         const userDataStr = localStorage.getItem('user_data');
        
//         if (token && userDataStr) {
//           const userData = JSON.parse(userDataStr);
          
//           // Check if account is pending review
//           if (userData.account_status === 'pending_review') {
//             console.log('[Auth Check] Account pending review, redirecting to profile verification step 6');
//             localStorage.setItem('redirect_to_step', '6');
//             router.replace('/profile-verification');
//             return;
//           }
          
//           // User is logged in and approved, redirect to dashboard
//           router.replace('/dashboard');
//           return;
//         }
//       } catch (error) {
//         console.error('Error checking existing auth:', error);
//       } finally {
//         setIsCheckingAuth(false);
//       }
//     };

//     // Small delay to ensure localStorage is available
//     const timeoutId = setTimeout(checkExistingAuth, 100);
//     return () => clearTimeout(timeoutId);
//   }, [router]);

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   }, []);

//   const handleOtpChange = useCallback((index: number, value: string) => {
//     if (value.length <= 1) {
//       const newOtp = [...otpValues];
//       newOtp[index] = value;
//       setOtpValues(newOtp);
//       if (value && index < 5) {
//         const nextInput = document.getElementById(`otp-${index + 1}`);
//         nextInput?.focus();
//       }
//     }
//   }, [otpValues]);

//   const handleOtpPaste = useCallback((pastedData: string) => {
//     // Check if pasted data is numeric and has 6 digits
//     if (/^\d{6}$/.test(pastedData)) {
//       const newOtp = pastedData.split('');
//       setOtpValues(newOtp);
      
//       // Focus on the last input
//       const lastInput = document.getElementById('otp-5');
//       lastInput?.focus();
//     }
//   }, []);

//   const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
//       // If current box is empty and backspace is pressed, move to previous box
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       prevInput?.focus();
//     }
//   }, [otpValues]);

//   const handleSendOTP = useCallback(async () => {
//     if (!formData.email) {
//       toast.error('Please enter your email address');
//       return;
//     }
//     try {
//       setIsSubmitting(true);
//       // API call to send verification code to email
//       const res = await fetch('https://real-leaders.com/wp-json/verified-real-leaders/v1/login/send-verification-code', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: formData.email })
//       });
//       const data = await res.json();
      
//       // Show response in toast
//       if (data?.success) {
//         toast.success(data?.message || 'Verification code sent to your email');
//         setCurrentScreen('verify-otp');
//       } else {
//         toast.error(data?.message || 'Failed to send verification code. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Network error. Please try again.');
//       console.error('Send OTP error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [formData.email]);

//   const handleVerifyOTP = useCallback(async () => {
//     const otpCode = otpValues.join('');
//     if (otpCode.length !== 6) {
//       toast.error('Please enter the complete 6-digit OTP');
//       return;
//     }
//     try {
//       setIsSubmitting(true);
//       const res = await fetch('https://real-leaders.com/wp-json/verified-real-leaders/v1/login/verify-code-and-login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: formData.email, 
//           code: parseInt(otpCode, 10)
//         })
//       });
//       const data = await res.json();
      
//       // Show response in toast
//       if (data?.success) {
//         // Store token and user data
//         if (data?.token) {
//           try { 
//             localStorage.setItem('auth_token', data.token);
//             if (data?.user) {
//               localStorage.setItem('user_data', JSON.stringify(data.user));
//             }
//             if (data?.user_id) {
//               localStorage.setItem('user_id', data.user_id.toString());
//             }
            
//             // Check account status before redirecting
//             if (data?.user?.account_status === 'pending_review') {
//               console.log('[OTP Verify] Account pending review, redirecting to profile verification step 6');
//               localStorage.setItem('redirect_to_step', '6');
//               router.replace('/profile-verification');
//               return;
//             }
            
//             toast.success(data?.message || 'Login successful!');
//             router.push('/dashboard');
//           } catch (error) {
//             console.error('Error storing auth data:', error);
//           }
//         }
//       } else {
//         toast.error(data?.message || 'Invalid verification code. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Network error. Please try again.');
//       console.error('Verify OTP error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [otpValues, formData.email, router]);

//   const handleSubmit = useCallback((e: React.FormEvent) => {
//     e.preventDefault();
//     if (currentScreen === 'signin') {
//       void handleSendOTP();
//     } else if (currentScreen === 'verify-otp') {
//       void handleVerifyOTP();
//     }
//   }, [currentScreen, handleSendOTP, handleVerifyOTP]);

//   // Handle Google/LinkedIn OAuth callback
//   React.useEffect(() => {
//     const handleSocialCallback = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const status = urlParams.get('status');
//       const tempToken = urlParams.get('token');
//       const message = urlParams.get('message');
//       const accountStatus = urlParams.get('account_status');
//       const isLoggedIn = urlParams.get('is_logged_in');
//       const userId = urlParams.get('user_id');

//       console.log('[Social Callback] URL Params:', {
//         status,
//         tempToken: tempToken ? 'present' : 'missing',
//         message,
//         accountStatus,
//         isLoggedIn,
//         userId
//       });

//       if (status === 'success' && tempToken) {
//         try {
//           setIsSubmitting(true);
//           setIsCheckingAuth(false);
          
//           console.log('[Social Callback] Processing successful auth...');
//           console.log('[Social Callback] is_logged_in:', isLoggedIn);
//           console.log('[Social Callback] account_status:', accountStatus);
          
//           // Check if user is already logged in (existing user)
//           if (isLoggedIn === '1') {
//             console.log('[Social Callback] User is logged in, fetching permanent token...');
            
//             // Get permanent token
//             const { api } = await import('@/lib/api');
//             const response = await api.getUserDetailsWithToken(tempToken);
            
//             console.log('[Social Callback] API Response:', {
//               success: response.success,
//               hasToken: !!response.token,
//               hasUser: !!response.user,
//               accountStatus: response.user?.account_status
//             });
            
//             if (response.success && response.token) {
//               localStorage.setItem('auth_token', response.token);
//               localStorage.setItem('user_data', JSON.stringify(response.user));
//               localStorage.setItem('user_id', response.user.id.toString());
              
//               // Check account status
//               if (response.user.account_status === 'pending_review') {
//                 console.log('[Social Callback] Account pending review, redirecting to profile verification step 6');
//                 localStorage.setItem('redirect_to_step', '6');
//                 router.replace('/profile-verification');
//                 return;
//               }
              
//               console.log('[Social Callback] Token stored, redirecting to dashboard...');
//               toast.success(message || 'Login successful!');
              
//               // Use replace instead of push to avoid back button issues
//               router.replace('/dashboard');
//             } else {
//               console.error('[Social Callback] Invalid response from API');
//               toast.error('Failed to complete login. Please try again.');
//             }
//           } else if (accountStatus === 'pending_review') {
//             // New signup - account pending review
//             console.log('[Social Callback] New signup - pending review, redirecting to profile verification step 6');
            
//             // Store user data
//             if (tempToken && userId) {
//               localStorage.setItem('temp_auth_token', tempToken);
//               localStorage.setItem('user_id', userId);
//             }
            
//             localStorage.setItem('redirect_to_step', '6');
//             router.replace('/profile-verification');
//           } else if (accountStatus === 'approved') {
//             // Account approved but not logged in yet - fetch token
//             console.log('[Social Callback] Account approved, fetching token...');
            
//             const { api } = await import('@/lib/api');
//             const response = await api.getUserDetailsWithToken(tempToken);
            
//             if (response.success && response.token) {
//               localStorage.setItem('auth_token', response.token);
//               localStorage.setItem('user_data', JSON.stringify(response.user));
//               localStorage.setItem('user_id', response.user.id.toString());
              
//               toast.success(message || 'Login successful!');
//               router.replace('/dashboard');
//             }
//           } else {
//             console.log('[Social Callback] Account not approved');
//             toast.error('Account not approved yet. Please wait for admin approval.');
//             window.history.replaceState({}, document.title, '/login');
//           }
//         } catch (error) {
//           console.error('[Social Callback] Error:', error);
//           toast.error('Failed to complete authentication');
//           window.history.replaceState({}, document.title, '/login');
//         } finally {
//           setIsSubmitting(false);
//         }
//       } else if (status === 'failed') {
//         console.log('[Social Callback] Auth failed:', message);
//         toast.error(message || 'Authentication failed');
//         window.history.replaceState({}, document.title, '/login');
//       }
//     };

//     void handleSocialCallback();
//   }, [router]);

//   // Social login handlers
//   const handleGoogleLogin = useCallback(async () => {
//     try {
//       const { api } = await import('@/lib/api');
//       const redirectUrl = `${window.location.origin}/login`;
//       api.initiateGoogleAuth(redirectUrl);
//     } catch (error) {
//       console.error('Google login error:', error);
//       toast.error('Google login failed');
//     }
//   }, []);

//   const handleAppleLogin = useCallback(async () => {
//     try {
//       // Implement Apple OAuth login
//       toast.info('Apple login coming soon...');
//     } catch {
//       toast.error('Apple login failed');
//     }
//   }, []);

//   const handleLinkedInLogin = useCallback(async () => {
//     try {
//       const { api } = await import('@/lib/api');
//       const redirectUrl = `${window.location.origin}/login`;
//       api.initiateLinkedInAuth(redirectUrl);
//     } catch (error) {
//       console.error('LinkedIn login error:', error);
//       toast.error('LinkedIn login failed');
//     }
//   }, []);

//   const SignInScreen = useMemo(() => (
//     <>
//       <div className="text-center mb-8">
//         <h1 className="section-title mb-4" style={{color:"white"}}>Welcome back to RealLeaders</h1>
//       </div>

//       <div className="space-y-6">
    
//         {/* Email Input */}
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <Mail className="text-white" size={16} />
//             <span className="text-sm font-medium text-white font-outfit">Email Address</span>
//           </div>
//           <div className="firstVerifyScreen mx-auto group">
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
//               placeholder="you@realleaders.com"
//               required
//             />
//           </div>
//         </div>

//  <div className="flex items-center justify-between">
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleInputChange}
//               className="w-4 h-4 text-custom-red border-gray-300 rounded focus:ring-custom-red"
//             />
//             <span className="ml-2 text-sm text-white font-outfit">Remember me on this device</span>
//           </label>
//           <button
//             type="button"
//             onClick={() => setCurrentScreen('forgot-email')}
//             className="text-sm text-custom-red hover:text-red-600 transition-colors font-outfit"
//           >
//             Forgot email?
//           </button>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className="w-full h-12 sm:h-14 bg-custom-red hover:bg-custom-red/90 disabled:bg-custom-red/70 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition flex items-center justify-center gap-3"
//         >
//           {isSubmitting ? (
//             <>
//               <svg
//                 className="animate-spin h-6 w-6 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 ></path>
//               </svg>
//               Sending OTP...
//             </>
//           ) : (
//             'Login'
//           )}
//         </button>
//         {/* Divider */}
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-600"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-black text-white font-outfit">Or continue with Social Login</span>
//           </div>
//         </div>

//             {/* Social Login Buttons */}
// <div className="space-y-4">
//           <SocialLoginButtons
//             onGoogleLogin={handleGoogleLogin}
//             onLinkedInLogin={handleLinkedInLogin}
//             isLoading={isSubmitting}
//           />
//         </div>
       
//       </div>
//     </>
//   ), [formData, handleInputChange, handleSubmit, isSubmitting, handleGoogleLogin, handleAppleLogin, handleLinkedInLogin]);

//   const VerifyOtpScreen = useMemo(() => (
//     <OtpVerificationSection
//       otpValues={otpValues}
//       handleOtpChange={handleOtpChange}
//       handleOtpPaste={handleOtpPaste}
//       handleOtpKeyDown={handleOtpKeyDown}
//       handleSubmit={handleSubmit}
//       onBack={() => setCurrentScreen('signin')}
//       isSubmitting={isSubmitting}
//     />
//   ), [otpValues, handleOtpChange, handleOtpPaste, handleOtpKeyDown, handleSubmit, isSubmitting]);

//   const ForgotEmailScreen = useMemo(() => (
//     <ForgotEmailSection
//       onBack={() => setCurrentScreen('signin')}
//     />
//   ), []);

//   const renderCurrentScreen = () => {
//     switch (currentScreen) {
//       case 'signin':
//         return SignInScreen;
//       case 'verify-otp':
//         return VerifyOtpScreen;
//       case 'forgot-email':
//         return ForgotEmailScreen;
//       default:
//         return SignInScreen;
//     }
//   };

//   // Show loading only while checking authentication (not for isSubmitting)
//   if (isCheckingAuth) {
//     return (
//       <LoadingScreen text1='Checking authentication...'/>
//     );
//   }

//   return (
//     <div className="h-screen lg:min-h-screen bg-gray-800 flex items-center justify-center p-0 sm:p-4" style={{background:"#f9efef"}}>
//       <div className="flex flex-col lg:flex-row w-full h-full lg:max-w-6xl lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:min-h-[700px]">
//         <div className="w-full h-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 relative flex flex-col justify-center" style={{background:"black"}}>
//           <div className="text-center mb-6 lg:mb-8 flex justify-center">
//             <Image src={images.realLeaders} alt='' className="realLeadersLogo" />
//           </div>
//           {renderCurrentScreen()}
//         </div>
//         <div className="hidden lg:block w-1/2 h-auto">
//   <InteractiveMagazineCards />
// </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

'use client';
import React, { useState, useEffect, FC } from "react";
import { Mail, ArrowLeft, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { images } from "@/assets";
import { toast } from "@/components/ui/toast";

// Types
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onLinkedInLogin: () => void;
  isLoading: boolean;
}

interface ForgotEmailSectionProps {
  onBack: () => void;
}

interface UserData {
  id: number;
  account_status: string;
  [key: string]: unknown;
}

interface APIResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserData;
  user_id?: number;
}

type ScreenType = "signin" | "verify-otp" | "forgot-email";

// OTP Input Component
const OTPInput: FC<OTPInputProps> = ({ value, onChange }) => {
  const handleChange = (index: number, val: string): void => {
    if (val.length <= 1 && /^\d*$/.test(val)) {
      const newValue = value.split("");
      newValue[index] = val;
      onChange(newValue.join(""));

      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      onChange(pastedData);
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-14 h-14 text-center text-2xl font-bold border-2 border-zinc-600 bg-transparent text-white rounded-lg focus:border-red-500 focus:outline-none transition"
        />
      ))}
    </div>
  );
};

// Social Login Buttons Component
const SocialLoginButtons: FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onLinkedInLogin,
  isLoading,
}) => (
  <div className="space-y-3">
    <button
      onClick={onGoogleLogin}
      disabled={isLoading}
      className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-zinc-300 rounded-lg hover:bg-zinc-50 transition disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="text-zinc-700 font-medium">Continue with Google</span>
    </button>

    <button
      onClick={onLinkedInLogin}
      disabled={isLoading}
      className="w-full h-12 flex items-center justify-center gap-3 bg-[#0A66C2] rounded-lg hover:bg-[#094d92] transition disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
      <span className="text-white font-medium">Continue with LinkedIn</span>
    </button>
  </div>
);

// Forgot Email Section Component
const ForgotEmailSection: FC<ForgotEmailSectionProps> = ({ onBack }) => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Password reset link sent to your email!");
      setIsSubmitting(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white hover:text-zinc-300 transition"
      >
        <ArrowLeft size={20} />
        <span>Back to login</span>
      </button>
<div className="text-center">
 <div className="mb-8 inline-block bg-zinc-800 px-4 py-3 rounded-lg">
            <Image
              src={images.realLeaders}
              alt="Real Leaders"
              className="h-8 w-auto"
            />
          </div>
          </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Forgot your email?
        </h1>
        <p className="text-zinc-400">
          Enter your recovery email to reset your password
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 mb-2 text-white text-sm">
            <Mail size={16} />
            Recovery Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recovery@example.com"
            className="w-full h-12 px-4 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !email}
          className="w-full h-12 rounded-lg bg-[#cf3232] text-white font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </div>
    </div>
  );
};

const SignInPage: FC = () => {
  const router = useRouter();
  
  // States
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("signin");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usePassword, setUsePassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Check existing authentication
  useEffect(() => {
    const checkExistingAuth = (): void => {
      try {
        // Allow login page access - don't auto-redirect
        // User can manually access login page even if logged in
        console.log('[Auth Check] Login page loaded - allowing access');
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Error checking existing auth:", error);
        setIsCheckingAuth(false);
      }
    };

    const timeoutId = setTimeout(checkExistingAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router]);

  // Handle social OAuth callback
  useEffect(() => {
    const handleSocialCallback = async (): Promise<void> => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("status");
      const tempToken = urlParams.get("token");
      const message = urlParams.get("message");
      const accountStatus = urlParams.get("account_status");
      const isLoggedIn = urlParams.get("is_logged_in");
      const userId = urlParams.get("user_id");

      console.log('[Social Callback] URL Params:', {
        status,
        tempToken: tempToken ? 'present' : 'missing',
        message,
        accountStatus,
        isLoggedIn,
        userId
      });

      if (status === "success" && tempToken) {
        try {
          setIsSubmitting(true);
          setIsCheckingAuth(false);
          
          console.log('[Social Callback] Processing successful auth...');
          console.log('[Social Callback] is_logged_in:', isLoggedIn);
          console.log('[Social Callback] account_status:', accountStatus);

          // Check if user is already logged in (existing user)
          if (isLoggedIn === "1") {
            console.log('[Social Callback] User is logged in, fetching permanent token...');
            
            // Get permanent token using api.getUserDetailsWithToken
            const { api } = await import('@/lib/api');
            const response = await api.getUserDetailsWithToken(tempToken);
            
            console.log('[Social Callback] API Response:', {
              success: response.success,
              hasToken: !!response.token,
              hasUser: !!response.user,
              accountStatus: response.user?.account_status
            });

            if (response.success && response.token) {
              localStorage.setItem("auth_token", response.token);
              localStorage.setItem("user_data", JSON.stringify(response.user));
              localStorage.setItem("user_id", response.user.id.toString());

              // Check account status
              if (response.user.account_status === "pending_review") {
                console.log('[Social Callback] Account pending review, redirecting to profile verification step 2 (Experience)');
                
                // Store user data for autofill in profile verification
                if (response.user.first_name || response.user.last_name) {
                  localStorage.setItem("profile_first_name", response.user.first_name || "");
                  localStorage.setItem("profile_last_name", response.user.last_name || "");
                  console.log('[Social Callback] Stored first_name and last_name for autofill:', {
                    first_name: response.user.first_name,
                    last_name: response.user.last_name
                  });
                }
                
                // Store profile picture URL for autofill
                if (response.user.profile_picture_url) {
                  localStorage.setItem("profile_picture_url", response.user.profile_picture_url);
                  console.log('[Social Callback] Stored profile_picture_url for autofill:', response.user.profile_picture_url);
                }
                
                // Set redirect step before navigation
                localStorage.setItem("redirect_to_step", "2");
                
                toast.success('Please complete the next steps to finish your profile', { autoClose: 5000 });
                
                // Small delay to ensure localStorage is written
                setTimeout(() => {
                  router.replace('/profile-verification');
                }, 100);
                return;
              }
              
              console.log('[Social Callback] Token stored, redirecting to Magic Publishing...');
              toast.success(message || "Login successful!");
              
              // Use replace instead of push to avoid back button issues
              router.replace('/dashboard/analytics');
            } else {
              console.error('[Social Callback] Invalid response from API');
              toast.error('Failed to complete login. Please try again.');
            }
          } else if (accountStatus === "pending_review") {
            // New signup - account pending review
            console.log('[Social Callback] New signup - pending review, redirecting to profile verification step 2 (Experience)');
            
            // Fetch user details to get first_name, last_name, and profile_picture_url
            const { api } = await import('@/lib/api');
            const response = await api.getUserDetailsWithToken(tempToken);
            
            if (response.success && response.user) {
              // Store user data for autofill in profile verification
              if (response.user.first_name || response.user.last_name) {
                localStorage.setItem("profile_first_name", response.user.first_name || "");
                localStorage.setItem("profile_last_name", response.user.last_name || "");
                console.log('[Social Callback] Stored first_name and last_name for autofill:', {
                  first_name: response.user.first_name,
                  last_name: response.user.last_name
                });
              }
              
              // Store profile picture URL for autofill
              if (response.user.profile_picture_url) {
                localStorage.setItem("profile_picture_url", response.user.profile_picture_url);
                console.log('[Social Callback] Stored profile_picture_url for autofill:', response.user.profile_picture_url);
              }
              
              // Store auth data
              localStorage.setItem("auth_token", response.token || tempToken);
              localStorage.setItem("user_data", JSON.stringify(response.user));
              localStorage.setItem("user_id", response.user.id.toString());
            } else if (tempToken && userId) {
              // Fallback if API call fails
              localStorage.setItem("temp_auth_token", tempToken);
              localStorage.setItem("user_id", userId);
            }
            
            // Set redirect step before navigation
            localStorage.setItem("redirect_to_step", "2");
            
            toast.success('Please complete the next steps to finish your profile', { autoClose: 5000 });
            
            // Small delay to ensure localStorage is written
            setTimeout(() => {
              router.replace('/profile-verification');
            }, 100);
          } else if (accountStatus === "approved") {
            // Account approved but not logged in yet - fetch token
            console.log('[Social Callback] Account approved, fetching token...');
            
            const { api } = await import('@/lib/api');
            const response = await api.getUserDetailsWithToken(tempToken);

            if (response.success && response.token) {
              localStorage.setItem("auth_token", response.token);
              localStorage.setItem("user_data", JSON.stringify(response.user));
              localStorage.setItem("user_id", response.user.id.toString());
              
              toast.success(message || "Login successful!");
              router.replace('/dashboard/analytics');
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
      } else if (status === "failed") {
        console.log('[Social Callback] Auth failed:', message);
        toast.error(message || "Authentication failed");
        window.history.replaceState({}, document.title, '/login');
      }
    };

    void handleSocialCallback();
  }, [router]);

  // Send OTP
  const handleSendOTP = async (): Promise<void> => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        "https://real-leaders.com/wp-json/verified-real-leaders/v1/login/send-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data: APIResponse = await res.json();

      if (data?.success) {
        toast.success(data?.message || "Verification code sent!");
        setCurrentScreen("verify-otp");
      } else {
        toast.error(data?.message || "Failed to send code");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Send OTP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login with password
  const handlePasswordLogin = async (): Promise<void> => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsSubmitting(true);
      const { api } = await import('@/lib/api');
      const data = await api.loginWithPassword(email, password);

      if (data?.success && data?.token) {
        localStorage.setItem("auth_token", data.token);
        if (data?.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
        if (data?.user_id) {
          localStorage.setItem("user_id", data.user_id.toString());
        }

        if (data?.user?.account_status === "pending_review") {
          console.log('[Password Login] Account pending review, redirecting to profile verification step 2 (Experience)');
          
          // Set redirect step before navigation
          localStorage.setItem("redirect_to_step", "2");
          
          toast.success('Please complete the next steps to finish your profile', { autoClose: 5000 });
          
          // Small delay to ensure localStorage is written
          setTimeout(() => {
            router.replace('/profile-verification');
          }, 100);
          return;
        }

        toast.success(data?.message || "Login successful!");
        router.push('/dashboard/analytics');
      } else {
        toast.error(data?.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      console.error("Password login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (): Promise<void> => {
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        "https://real-leaders.com/wp-json/verified-real-leaders/v1/login/verify-code-and-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: parseInt(code, 10) }),
        }
      );
      const data: APIResponse = await res.json();

      if (data?.success) {
        if (data?.token) {
          localStorage.setItem("auth_token", data.token);
          if (data?.user) {
            localStorage.setItem("user_data", JSON.stringify(data.user));
          }
          if (data?.user_id) {
            localStorage.setItem("user_id", data.user_id.toString());
          }

          if (data?.user?.account_status === "pending_review") {
            console.log('[OTP Verify] Account pending review, redirecting to profile verification step 2 (Experience)');
            
            // Set redirect step before navigation
            localStorage.setItem("redirect_to_step", "2");
            
            toast.success('Please complete the next steps to finish your profile', { autoClose: 5000 });
            
            // Small delay to ensure localStorage is written
            setTimeout(() => {
              router.replace('/profile-verification');
            }, 100);
            return;
          }

          toast.success(data?.message || "Login successful!");
          router.push('/dashboard/analytics');
        }
      } else {
        toast.error(data?.message || "Invalid code");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Verify OTP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const { api } = await import('@/lib/api');
      const redirectUrl = `${window.location.origin}/login`;
      api.initiateGoogleAuth(redirectUrl);
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  };

  const handleLinkedInLogin = async (): Promise<void> => {
    try {
      const { api } = await import('@/lib/api');
      const redirectUrl = `${window.location.origin}/login`;
      api.initiateLinkedInAuth(redirectUrl);
    } catch (error) {
      console.error('LinkedIn login error:', error);
      toast.error('LinkedIn login failed');
    }
  };

  const handleResendCode = async (): Promise<void> => {
    try {
      setIsResending(true);
      const res = await fetch(
        "https://real-leaders.com/wp-json/verified-real-leaders/v1/login/send-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data: APIResponse = await res.json();
      toast.success(data?.message || "Code resent!");
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  // Loading screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // OTP Verification Screen
  if (currentScreen === "verify-otp") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white p-4 sm:p-8">
        <div className="w-full max-w-lg text-center">
          <button
            onClick={() => setCurrentScreen("signin")}
            className="flex items-center gap-2 mb-6 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="mb-8 inline-block bg-zinc-800 px-4 py-3 rounded-lg">
            <Image
              src={images.realLeaders}
              alt="Real Leaders"
              className="h-8 w-auto"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center" style={{marginBottom:"50px"}}>
            Enter the 6-digit code sent to you at {email.replace(/(.{1})(.*)(@.*)/, '$1******$3')}.
          </h1>
         

          <div className="mb-6">
            <OTPInput value={code} onChange={setCode} />
          </div>

         
          <div className="mt-6 mb-6 text-center flex items-center justify-center gap-4">
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="px-6 py-2 rounded-full border border-zinc-600 text-white hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Resending...
                </>
              ) : (
                'Resend code'
              )}
            </button>
            
            {/* <button
              onClick={() => {
                setUsePassword(true);
                setCurrentScreen("signin");
              }}
              className="text-sm text-red-500 hover:text-red-400 transition underline"
            >
              Use Password Instead
            </button> */}
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={code.length !== 6 || isSubmitting}
            className="w-full h-14 rounded-full bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verifying...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Forgot Email Screen
  if (currentScreen === "forgot-email") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <ForgotEmailSection onBack={() => setCurrentScreen("signin")} />
        </div>
      </div>
    );
  }

  // Main Sign In Screen
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-zinc-50">
      {/* Left: Sign-in panel */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-zinc-900 text-white">
        <div className="w-full max-w-lg">
          <div className="mb-8 inline-block bg-zinc-800 px-4 py-3 rounded-lg">
            <Image
              src={images.realLeaders}
              alt="Real Leaders"
              className="h-8 w-auto"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Welcome back
          </h1>
          <p className="text-zinc-400 mb-8">Log in to Real Leaders</p>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} />
                <label className="text-sm font-medium">Email Address</label>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@realleaders.com"
                className="w-full h-12 px-4 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyDown={(e) => e.key === "Enter" && (usePassword ? handlePasswordLogin() : handleSendOTP())}
              />
            </div>

            {usePassword && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={16} />
                  <label className="text-sm font-medium">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyDown={(e) => e.key === "Enter" && handlePasswordLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-600"
                />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              <button
                onClick={() => router.push(usePassword ? '/forgot-password' : '/forgot-password')}
                className="text-sm text-red-500 hover:text-red-400 transition"
              >
                {usePassword ? 'Forgot password?' : 'Forgot email?'}
              </button>
            </div>

            <button
              onClick={usePassword ? handlePasswordLogin : handleSendOTP}
              disabled={isSubmitting || !email || (usePassword && !password)}
              className="w-full h-12 rounded-full bg-[#cf3232] text-white font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {usePassword ? 'Logging in...' : 'Sending...'}
                </>
              ) : (
                "Login"
              )}
            </button>

          

            {usePassword && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setUsePassword(false);
                    setPassword('');
                  }}
                  className="text-sm text-zinc-400 hover:text-white transition"
                >
                  Or{' '}
                  <span className="text-red-500 hover:text-red-400 underline">
                    login with verification code
                  </span>
                </button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialLoginButtons
              onGoogleLogin={handleGoogleLogin}
              onLinkedInLogin={handleLinkedInLogin}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Right: Visual showcase */}
      <div className="hidden lg:block relative min-h-screen bg-black">
        <Image
          src={images.signHeroSection}
          alt="Real Leaders"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/10 to-transparent" />
      </div>
    </div>
  );
};

export default SignInPage;