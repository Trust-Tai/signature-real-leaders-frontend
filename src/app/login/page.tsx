'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { images } from '@/assets';
import ForgotPasswordSection from '@/components/ui/ForgotPasswordSection';
import OtpVerificationSection from '@/components/ui/OtpVerificationSection';
import UpdatePasswordSection from '@/components/ui/UpdatePasswordSection';
import { toast } from '@/components/ui/toast';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';

const LoginPage = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<'signin' | 'forgot-password' | 'verify-otp' | 'update-password'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    rememberMe: false,
  });

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

  const handleLogin = useCallback(async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch('https://verified.real-leaders.com/wp-json/verified-real-leaders/v1/user/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        toast.success(data?.message || 'Login successful.');
        // Store token in localStorage
        if (data?.token) {
          try { 
            localStorage.setItem('auth_token', data.token);
            // Navigate to dashboard after successful login
            router.push('/dashboard');
          } catch {}
        }
      } else {
        const msg = data?.message || 'Login failed. Please check your credentials.';
        toast.error(msg);
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email, formData.password, router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (currentScreen === 'signin') {
      void handleLogin();
      return;
    }
    if (currentScreen === 'forgot-password') {
      setCurrentScreen('verify-otp');
    } else if (currentScreen === 'verify-otp') {
      setCurrentScreen('update-password');
    } else if (currentScreen === 'update-password') {
      setCurrentScreen('signin');
    }
  }, [currentScreen, handleLogin]);

  const SignInScreen = useMemo(() => (
    <>
      <div className="text-center mb-8">
        <h1 className="section-title text-white mb-4">Welcome back to RealLeaders</h1>
        <p className="subtitleheader- text-white">Sign in to continue your RealLeaders configurations and quotes.</p>
      </div>

      <div className="space-y-6">
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

        <div>
          <span className="block text-sm font-medium text-white mb-2 font-outfit">Password</span>
          <div className="relative firstVerifyScreen mx-auto group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput pr-12 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 my-auto text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
            onClick={() => setCurrentScreen('forgot-password')}
            className="text-sm text-custom-red hover:text-red-600 transition-colors font-outfit"
          >
            Forgot password?
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
      Logging in...
    </>
  ) : (
    'Login'
  )}
</button>

      </div>
    </>
  ), [formData, handleInputChange, handleSubmit, isSubmitting, showPassword]);

  const ForgotPasswordScreen = useMemo(() => (
    <ForgotPasswordSection
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      onBack={() => setCurrentScreen('signin')}
    />
  ), [formData, handleInputChange, handleSubmit]);

  const VerifyOtpScreen = useMemo(() => (
    <OtpVerificationSection
      otpValues={otpValues}
      handleOtpChange={handleOtpChange}
      handleSubmit={handleSubmit}
      onBack={() => setCurrentScreen('forgot-password')}
    />
  ), [otpValues, handleOtpChange, handleSubmit]);

  const UpdatePasswordScreen = useMemo(() => (
    <UpdatePasswordSection
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      showNewPassword={showNewPassword}
      showConfirmPassword={showConfirmPassword}
      setShowNewPassword={setShowNewPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      onBack={() => setCurrentScreen('verify-otp')}
    />
  ), [formData, handleInputChange, handleSubmit, showNewPassword, showConfirmPassword]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return SignInScreen;
      case 'forgot-password':
        return ForgotPasswordScreen;
      case 'verify-otp':
        return VerifyOtpScreen;
      case 'update-password':
        return UpdatePasswordScreen;
      default:
        return SignInScreen;
    }
  };

  return (
    <div className="h-screen lg:min-h-screen bg-gray-800 flex items-center justify-center p-0 sm:p-4" style={{background:"#f9efef"}}>
      <div className="flex flex-col lg:flex-row w-full h-full lg:max-w-6xl lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:min-h-[700px]">
        <div className="w-full h-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 relative flex flex-col justify-center" style={{background:"black"}}>
          <div className="text-center mb-6 lg:mb-8 flex justify-center">
            <Image src={images.realLeaders} alt='' className="realLeadersLogo" />
          </div>
          {renderCurrentScreen()}
        </div>
        <div style={{width:"50%",height:"auto"}}>
        <InteractiveMagazineCards />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


