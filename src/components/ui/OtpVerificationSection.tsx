'use client'
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface OtpVerificationSectionProps {
  otpValues: string[];
  handleOtpChange: (index: number, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const OtpVerificationSection: React.FC<OtpVerificationSectionProps> = ({
  otpValues,
  handleOtpChange,
  handleSubmit,
  onBack
}) => {
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
        <p className="text-white text-sm font-outfit">We&apos;ve sent a 6-digit verification code to your email address. Please enter it below.</p>
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
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
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
          className="w-full h-12 sm:h-14 bg-red-600 hover:bg-red-700 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition"
        >
          Verify & Continue
        </button>
      </div>
    </>
  );
};

export default OtpVerificationSection;


