"use client"

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import SocialLoginButtons from './SocialLoginButtons';
import { toast } from '@/components/ui/toast';

interface CombinedEmailOtpSectionProps {
  onSendCode: (email: string) => void;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onLinkedInLogin?: () => void;
  className?: string;
  error?: string;
  isLoading?: boolean;
  infoMessage?: string;
  resendResponseMessage?: string;
  showOtpInput?: boolean;
}

const CombinedEmailOtpSection: React.FC<CombinedEmailOtpSectionProps> = ({
  onSendCode,
  onVerify,
  onResendCode,
  onGoogleLogin,
  onAppleLogin,
  onLinkedInLogin,
  className,
  error,
  isLoading = false,
  infoMessage,
  resendResponseMessage,
  showOtpInput = false
}) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (infoMessage) {
      toast.info(infoMessage, { id: 'otp-info' });
    }
  }, [infoMessage]);

  useEffect(() => {
    if (resendResponseMessage) {
      toast.info(resendResponseMessage, { id: 'otp-resend' });
    }
  }, [resendResponseMessage]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !isValidEmail) {
      console.log('Invalid email:', email);
      return;
    }
    
    console.log('Sending email to parent:', email);
    onSendCode(email);
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newCode = [...code];
      const digits = pastedData.split('');
      
      for (let i = 0; i < digits.length && (index + i) < 6; i++) {
        newCode[index + i] = digits[i];
      }
      
      setCode(newCode);
      
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      
      if (newCode.every(digit => digit !== '')) {
        onVerify(newCode.join(''));
      }
    }
  };

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        {showOtpInput ? 'ENTER CODE (VIA EMAIL)' : 'CREATE YOUR ACCOUNT'}
      </h2>

      {/* Email Form - Always visible */}
      {!showOtpInput && (
        <>
          <div className="space-y-6">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className='firstVerifyScreen mx-auto group'>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 w-full text-gray-700 rounded-lg focus:outline-none transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  placeholder="Enter your email address..."
                  required
                  disabled={!!isLoading}
                  aria-busy={!!isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!isValidEmail || !!isLoading}
                className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    SENDING...
                  </>
                ) : (
                  'SEND VERIFICATION CODE'
                )}
              </button>

              {error && (
                <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 font-outfit text-sm">or continue with Social Login</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <SocialLoginButtons
              onGoogleLogin={onGoogleLogin}
              onAppleLogin={onAppleLogin}
              onLinkedInLogin={onLinkedInLogin}
              isLoading={isLoading}
            />
          </div>
        </>
      )}

      {/* OTP Input - Shows after email is sent */}
      {showOtpInput && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-center space-x-3 sm:space-x-4" style={{marginBottom:10}}>
            {code.map((digit, index) => (
              <div key={index} className='firstVerifyScreen'>
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(e, index)}
                  className={cn(
                    "text-center font-bold font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-custom-red/20",
                    "w-[50px] h-[50px] sm:w-14 sm:h-14 text-xl sm:text-2xl",
                    "xl:w-16 xl:h-20 xl:text-2xl",
                    "border-2 border-custom-red-border",
                    "firstVerifyScreenInput",
                    digit
                      ? "text-custom-red bg-white"
                      : "text-gray-400 bg-white",
                    error && "text-custom-red"
                  )}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <p className="font-outfit mx-auto leading-relaxed" style={{fontSize:15, color: '#656060'}}>
            check your email for your Real Leaders access code
          </p>
          
          <button
            type="submit"
            className="custom-btn mt-4 mb-0 disabled:opacity-50"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'VERIFYING...' : 'VERIFY AND CONTINUE'}
          </button>

          {error && (
            <p className="text-custom-red text-sm font-outfit">{error}</p>
          )}

          {/* Resend Code Link */}
          <div className="p-2">
            <button
              onClick={onResendCode}
              disabled={isLoading}
              className=""
              aria-busy={isLoading}
            >
              <span className="font-outfit font-normal transition-colors duration-200" style={{fontSize:15, color: '#656060'}}>
                Didn&apos;t receive the code?{' '}
                <span className="font-outfit font-medium hover:text-custom-red transition-colors duration-200" style={{fontSize:15, color: '#000000'}}>
                  {isLoading ? '[Resending...]' : '[Resend]'}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedEmailOtpSection;
