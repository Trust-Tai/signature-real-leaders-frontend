"use client"

import { images } from '@/assets';
import Image from 'next/image';
import React from 'react';
import { trackProfileVerificationSuccess } from '@/lib/conversionTracking';

interface PendingReviewSectionProps {
  className?: string;
}

const PendingReviewSection: React.FC<PendingReviewSectionProps> = ({
  className
}) => {
  // Fire conversion tracking when this component mounts (backup tracking)
  React.useEffect(() => {
    console.log('[Conversion Tracking] PendingReviewSection mounted - firing backup success event');
    trackProfileVerificationSuccess();
  }, []);

  return (
    <div className={`min-h-screen flex items-start justify-center p-4 sm:p-8 animate-fade-in-up ${className || ''}`} 
        style={{marginTop: 100}}>
      <div className="text-center space-y-6 sm:space-y-8 max-w-2xl px-4">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-8 sm:mb-12 animate-fade-in-down">
                  <Image
                           src={images.reviewVerified}
                           alt="Review verified"
                           className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[144px] lg:h-[134px] animate-pulse"
                         />
               </div>

        {/* Main Message */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight animate-fade-in" 
              style={{ 
                color: '#CF3232',
                fontFamily: "Abolition Test",
                fontStyle: 'normal',
                fontSize: '48px',
                fontWeight: 400
              }}>
            YOUR ACCOUNT IS<br />
            PENDING REVIEW
          </h1>
          
          {/* Subtitle Text */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg leading-relaxed font-outfit font-medium animate-fade-in" 
               style={{ color: '#333333CC' }}>
              Thank you for signing up! Your account is currently under review.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-outfit font-medium animate-fade-in" 
               style={{ color: '#333333' }}>
              We&apos;ll send you an email notification once your account has been approved and is ready to use.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 sm:mt-12 p-6 bg-gray-50 rounded-lg animate-fade-in">
          <h3 className="text-lg font-semibold mb-3 font-outfit" style={{ color: '#CF3232' }}>
            What happens next?
          </h3>
          <ul className="text-left space-y-2 text-sm sm:text-base font-outfit text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Our team will review your application within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>You&apos;ll receive an email confirmation once approved</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>You can then access your dashboard and start using RealLeaders</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-12 space-y-4 animate-fade-in">
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-sm text-gray-600 font-outfit">
              You will be notified via email once your account is approved
            </p>
            
            <button 
              onClick={() => {
                // Clear auth data and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                localStorage.removeItem('user_id');
                window.location.href = '/login';
              }}
              className="w-full sm:w-auto px-8 py-3 bg-[#CF3232] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 font-outfit text-center"
            >
              ALREADY HAVE AN ACCOUNT?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingReviewSection;