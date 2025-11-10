'use client'
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface OtpVerificationSectionProps {
  otpValues: string[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpPaste: (pastedData: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const OtpVerificationSection: React.FC<OtpVerificationSectionProps> = ({
  otpValues,
  handleOtpChange,
  handleOtpPaste,
  handleOtpKeyDown,
  handleSubmit,
  onBack,
  isSubmitting = false
}) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    handleOtpPaste(pastedData);
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-white transition-colors font-outfit"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-4">Enter verification code</h1>
        <p className="text-white text-sm font-outfit">We&apos;ve sent a 6-digit verification code to your email address. Enter it below to sign in.</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-4 text-center font-outfit">
            Verification Code
          </label>
          <div className="flex justify-center space-x-3">
            {otpValues.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold border-2 border-[#efc0c0] rounded-lg focus:border-[#efc0c0] focus:outline-none focus:shadow-lg focus:shadow-red-100 transition-all font-outfit text-[#333333] bg-white"
              />
            ))}
          </div>
        </div>

        {/* Timer/Resend */}
        <div className="text-center">
          <p className="text-white text-sm mb-2 font-outfit">Code expires in 05:00</p>
          <button className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors font-outfit">
            Resend verification code
          </button>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-red-600 hover:bg-red-700 disabled:bg-red-600/70 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition flex items-center justify-center gap-3"
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
              Verifying...
            </>
          ) : (
            'Verify & Sign In'
          )}
        </button>
      </div>
    </>
  );
};

export default OtpVerificationSection;


