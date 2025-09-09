'use client'
import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

interface ForgotPasswordSectionProps {
  formData: {
    email: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const ForgotPasswordSection: React.FC<ForgotPasswordSectionProps> = ({
  formData,
  handleInputChange,
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
          Back to Sign In
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-4">Reset your password</h1>
        <p className="text-white text-sm font-outfit">Enter your email address and we&apos;ll send you a verification code to reset your password.</p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-2 font-outfit">
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

        {/* Send Verification Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-10 sm:h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition"
        >
          Send Verification Code
        </button>

        {/* Back to Sign In Link */}
        <div className="text-center">
          <span className="text-white font-outfit">Remember your password? </span>
          <button
            type="button"
            onClick={onBack}
            className="text-red-500 hover:text-red-600 font-medium transition-colors font-outfit"
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordSection;


