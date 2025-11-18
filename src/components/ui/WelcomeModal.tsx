"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { images } from '@/assets';

interface WelcomeModalProps {
  onStartTour: () => void;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartTour, onClose }) => {
  const router = useRouter();

  const handleSetupProfile = () => {
    onClose();
    router.push('/dashboard/profile');
  };

  const handleStartTour = () => {
    onClose();
    onStartTour();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-slide-up">
        {/* Logo/Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-24 h-24 bg-[#000] rounded-2xl flex items-center justify-center">
            <Image 
              src={images.realLeaders}
              width={80} 
              height={80} 
              alt="Real Leaders Logo"
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <h2 className="text-2xl font-bold text-[#101117] mb-4 font-outfit">
            Welcome to your Signature Dashboard
          </h2>
          
          <p className="text-gray-600 mb-2 font-outfit">
            This is where you&apos;ll track page views, clicks, newsletter subscribers, verified members, and analytics. 
          </p>
          
          <p className="text-gray-600 mb-6 font-outfit">
            You can also use{' '}
            <span className="text-[#CF3232] font-semibold">Magic Publishing</span>{' '}
            to generate a full content engine tailored to your audience.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartTour}
              className="px-6 py-3 bg-[#CF3232] text-white rounded-lg font-semibold hover:bg-[#B82828] transition-all duration-200 shadow-md hover:shadow-lg font-outfit"
            >
              Start guided tour
            </button>
            
            <button
              onClick={handleSetupProfile}
              className="px-6 py-3 bg-white text-[#101117] border-2 border-gray-200 rounded-lg font-semibold hover:border-[#CF3232] hover:text-[#CF3232] transition-all duration-200 font-outfit"
            >
              Complete Your Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
