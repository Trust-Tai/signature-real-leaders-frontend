'use client'
import React from 'react';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';

interface UpdatePasswordSectionProps {
  formData: {
    newPassword: string;
    confirmPassword: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  onBack: () => void;
}

const UpdatePasswordSection: React.FC<UpdatePasswordSectionProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  showNewPassword,
  showConfirmPassword,
  setShowNewPassword,
  setShowConfirmPassword,
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
      <div className="text-center mb-4">
        <h1 className="text-[28px] lg:text-[35px] font-abolition text-white mb-2">Update your password</h1>
        <p className="text-white text-sm font-outfit">Choose a strong password to secure your RealLeaders account.</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            New Password
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className="flex-1 border-none outline-none bg-white text-[#333333] placeholder-gray-400 font-outfit"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-gray-400 hover:text-gray-600 ml-3 transition-colors"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-1 font-outfit">
            Confirm Password
          </label>
          <div className="flex items-center h-10 sm:h-12 px-3 sm:px-4 border-2 border-[#efc0c0] rounded-lg bg-white focus-within:border-[#efc0c0] focus-within:shadow-lg focus-within:shadow-red-100 transition-all">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className="flex-1 border-none outline-none bg-white text-[#333333] placeholder-gray-400 font-outfit"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600 ml-3 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-[#333333] mb-1 font-outfit">Password must contain:</p>
          <div className="space-y-1 text-sm text-[#333333] font-outfit">
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              At least 8 characters
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              One uppercase letter
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              One lowercase letter
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2" />
              One number or special character
            </div>
          </div>
        </div>

        {/* Update Password Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-12 sm:h-14 bg-red-600 hover:bg-red-700 text-white text-[24px] font-normal rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-abolition"
        >
          Update Password
        </button>
      </div>
    </>
  );
};

export default UpdatePasswordSection;
