"use client";

import React from 'react';
import Image from 'next/image';
import { images } from '@/assets';

interface LoadingScreenProps {
  text1?: string;
  text2?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text1 = "", text2 = "" }) => {
  return (
    <div className="fixed inset-0 bg-[#000] flex items-center justify-center z-50" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image 
            src={images.realLeaders} 
            alt="RealLeaders" 
            className="w-auto h-16 mx-auto" 
          />
        </div>
        
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CF3232]"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-[#fff] text-lg font-medium">
          {text1}
        </div>
        <div className="text-[#fff] text-sm mt-2">
          {text2}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
