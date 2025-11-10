"use client";

import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileCompletionCardProps {
  incompleteFields: string[];
  completionPercentage: number;
  onClose: () => void;
}

// API returns field names in readable format already
// So we'll use them as-is, but keep this mapping for any custom formatting if needed
const fieldLabels: Record<string, string> = {
  'Audience Description': 'Audience Description',
  'Newsletter Service': 'Newsletter Service',
  'API Key': 'Newsletter API Key',
  'Date of Birth': 'Date of Birth',
  'Occupation': 'Occupation',
  'Profile Privacy': 'Profile Privacy Settings',
  'First Name': 'First Name',
  'Last Name': 'Last Name',
  'Company Name': 'Company Name',
  'Company Website': 'Company Website',
  'Industry': 'Industry',
  'Signature': 'Signature',
  'Profile Picture': 'Profile Picture',
  'Primary Call to Action': 'Primary Call to Action',
  'Social Links': 'Social Links',
  'Profile Template': 'Profile Template',
};

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  incompleteFields,
  completionPercentage,
  onClose,
}) => {
  const router = useRouter();

  const handleSetupClick = () => {
    router.push('/dashboard/profile');
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-[#CF3232]" />
          <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Profile Completion</span>
            <span className="text-sm font-semibold text-[#CF3232]">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#CF3232] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Incomplete Fields */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Complete these fields to unlock all features:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {incompleteFields.map((field, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#CF3232]" />
                <span>{fieldLabels[field] || field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSetupClick}
          className="w-full bg-[#CF3232] text-white py-3 rounded-lg font-semibold hover:bg-[#B82828] transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};
