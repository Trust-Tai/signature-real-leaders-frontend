"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileCompletionCardProps {
  incompleteFields: string[];
  completionPercentage: number;
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
}) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSetupClick = () => {
    
      router.push('/dashboard/profile');
   
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate remaining tasks
  const totalTasks = 5; // You can adjust this based on your needs
  const completedTasks = Math.round((completionPercentage / 100) * totalTasks);

  if (!isExpanded) {
    // Minimized state - Compact box with icon and text
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        onClick={toggleExpand}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 hover:shadow-3xl transition-all duration-300 hover:scale-105 w-72">
          <div className="flex items-center space-x-3">
            {/* Circular Progress Icon */}
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#FEE3E3"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#CF3232"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - completionPercentage / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#CF3232] font-outfit">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 font-outfit mb-0.5">
                Setup your profile
              </h4>
              <p className="text-xs text-gray-500 font-outfit">
                {completedTasks} of {totalTasks} complete
              </p>
            </div>
            
            {/* Expand Icon */}
            <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-[#CF3232] transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  // Expanded state - Full card
  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slide-up">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Small circular progress */}
            <div className="relative w-16 h-16">
              <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#FEE3E3"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#CF3232"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#CF3232] font-outfit">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-outfit">
                Your setup checklist
              </h3>
              <p className="text-sm text-gray-500 font-outfit">
                {completedTasks} of {totalTasks} complete
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 space-y-3">
        {/* Missing Fields List */}
        {/* <div className="space-y-2 max-h-40 overflow-y-auto">
          {incompleteFields.slice(0, 5).map((field, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-[#CF3232]"></div>
              <span className="text-sm text-gray-700 font-outfit">{fieldLabels[field] || field}</span>
            </div>
          ))}
          {incompleteFields.length > 5 && (
            <p className="text-xs text-gray-500 pl-5 font-outfit">
              +{incompleteFields.length - 5} more fields
            </p>
          )}
        </div> */}
        {/* Progress Bar */}
        <div>
          {/* <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Profile Completion</span>
            <span className="text-sm font-semibold text-[#CF3232]">
              {completionPercentage}%
            </span>
          </div> */}
          {/* <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#CF3232] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div> */}
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

      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={handleSetupClick}
          className="w-full bg-[#CF3232] text-white py-4 rounded-xl font-semibold hover:bg-[#B82828] transition-all duration-200 shadow-md hover:shadow-lg font-outfit text-base"
        >
          Finish setup
        </button>
      </div>
    </div>
  );
};
