'use client'
import React, { useState, useCallback, useMemo } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';
import ForgotPasswordSection from '@/components/ui/ForgotPasswordSection';
import OtpVerificationSection from '@/components/ui/OtpVerificationSection';
import UpdatePasswordSection from '@/components/ui/UpdatePasswordSection';

const RealLeadersAuthPreview = () => {
  const [currentScreen, setCurrentScreen] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
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
      
      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  }, [otpValues]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Simulate different flows
    if (currentScreen === 'forgot-password') {
      setCurrentScreen('verify-otp');
    } else if (currentScreen === 'verify-otp') {
      setCurrentScreen('update-password');
    } else if (currentScreen === 'update-password') {
      setCurrentScreen('signin');
    }
  }, [formData, currentScreen]);


  const SignInScreen = useMemo(() => (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-4">Welcome back to RealLeaders</h1>
        <p className="text-white text-sm font-outfit">Sign in to continue your RealLeaders configurations and quotes.</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-8">
        <button 
          onClick={() => setCurrentScreen('signin')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors font-outfit ${
            currentScreen === 'signin' 
              ? 'border-red-500 text-white' 
              : 'border-gray-200 text-white hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button 
          onClick={() => setCurrentScreen('signup')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors font-outfit ${
            currentScreen === 'signup' 
              ? 'border-red-500 text-white' 
              : 'border-gray-200 text-white hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Email Address
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <Mail className="text-gray-400 mr-3" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@realleaders.com"
              className="flex-1 border-none outline-none bg-white text-[#333333]  font-outfit"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Password
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your password"
              className="flex-1 border-none outline-none bg-white text-[#333333] font-outfit"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white ml-3 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-white font-outfit">Remember me on this device</span>
          </label>
          <button
            onClick={() => setCurrentScreen('forgot-password')}
            className="text-sm text-red-500 hover:text-red-600 transition-colors font-outfit"
          >
            Forgot password?
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-12 sm:h-14 bg-red-600 hover:bg-red-700 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition"
        >
          Continue
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-white font-outfit">New to RealLeaders? </span>
          <button
            type="button"
            onClick={() => setCurrentScreen('signup')}
            className="text-red-500 hover:text-red-600 font-medium transition-colors font-outfit"
          >
            Create an account
          </button>
        </div>
      </div>
    </>
  ), [currentScreen, formData, handleInputChange, handleSubmit, showPassword, setCurrentScreen]);

  const SignUpScreen = useMemo(() => (
    <>
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-2">Create your RealLeaders account</h1>
        <p className="text-white text-sm font-outfit">Join RealLeaders to configure, quote, and manage your projects.</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-4">
        <button 
          onClick={() => setCurrentScreen('signin')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors font-outfit ${
            currentScreen === 'signin' 
              ? 'border-red-500 text-white' 
              : 'border-gray-200 text-white hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button 
          onClick={() => setCurrentScreen('signup')}
          className={`flex-1 py-2 text-center font-medium border-b-2 transition-colors font-outfit ${
            currentScreen === 'signup' 
              ? 'border-red-500 text-white' 
              : 'border-gray-200 text-white hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <div className="space-y-3 sm:space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Full Name
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="flex-1 border-none outline-none bg-white text-[#333333] font-outfit"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Company (optional)
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="RealLeaders Partners Inc."
              className="flex-1 border-none outline-none bg-white text-[#333333] placeholder-gray-400 font-outfit"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Email Address
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <Mail className="text-gray-400 mr-3" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@realleaders.com"
              className="flex-1 border-none outline-none bg-white text-[#333333] placeholder-gray-400 font-outfit"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Password
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className="flex-1 border-none outline-none bg-white text-[#333333] placeholder-gray-400 font-outfit"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white ml-3 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 mt-0.5"
            />
            <span className="ml-2 text-sm text-white">
              I agree to the{' '}
              <a href="#" className="text-red-500 hover:text-red-600 underline">RealLeaders Terms</a>
              {' '}and{' '}
              <a href="#" className="text-red-500 hover:text-red-600 underline">Privacy Policy</a>.
            </span>
          </label>
        </div>

        {/* Create Account Button */}
        <button
          onClick={handleSubmit}
          // disabled={!formData.agreeToTerms}
          className="w-full h-12 font-abolition sm:h-14 bg-red-600 hover:bg-red-700  text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none"
        >
          Create account
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-white">Already have a RealLeaders account? </span>
          <button
            type="button"
            onClick={() => setCurrentScreen('signin')}
            className="text-red-500 hover:text-red-600 font-medium transition-colors font-outfit"
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  ), [currentScreen, formData, handleInputChange, handleSubmit, showPassword, setCurrentScreen]);

  const ForgotPasswordScreen = useMemo(() => (
    <ForgotPasswordSection
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      onBack={() => setCurrentScreen('signin')}
    />
  ), [formData, handleInputChange, handleSubmit, setCurrentScreen]);

  const VerifyOtpScreen = useMemo(() => (
    <OtpVerificationSection
      otpValues={otpValues}
      handleOtpChange={handleOtpChange}
      handleSubmit={handleSubmit}
      onBack={() => setCurrentScreen('forgot-password')}
    />
  ), [otpValues, handleOtpChange, handleSubmit, setCurrentScreen]);

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
  ), [formData, handleInputChange, handleSubmit, showNewPassword, showConfirmPassword, setShowNewPassword, setShowConfirmPassword, setCurrentScreen]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return SignInScreen;
      case 'signup':
        return SignUpScreen;
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
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full h-full lg:max-w-6xl lg: lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:min-h-[700px]">
        {/* Left Side - Form */}
        <div className="w-full h-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12  relative flex flex-col justify-center" style={{background:"black"}}>
         

          {/* Logo */}
          <div className="text-center mb-6 lg:mb-8 flex justify-center">
            <Image src={images.realLeaders} alt='' className="w-auto h-8 sm:h-10 lg:h-12" />
          </div>

          {/* Dynamic Content */}
          {renderCurrentScreen()}
        </div>

        {/* Right Side - Image/Branding */}
        <div 
          className="hidden lg:flex w-full lg:w-1/2 relative overflow-hidden items-center justify-center min-h-[300px] lg:min-h-auto"
        >
          <Image 
            src={images.verifyFirstPageRightBgImage} 
            alt='' 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* <div className="relative z-10 text-center text-white p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-abolition mb-2 lg:mb-4">RealLeaders</h2>
            <p className="text-sm sm:text-base lg:text-lg font-outfit opacity-90">Make your mark with signature leadership</p>
          </div> */}
        </div>
      </div>

      
    </div>
  );
};

export default RealLeadersAuthPreview;