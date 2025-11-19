"use client";

import React from 'react';
import Image from 'next/image';
import gifLoading from "@/assets/images/loaderGif.gif" 
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
            src={gifLoading} 
            alt="RealLeaders" 
            className="w-auto h-16 mx-auto" 
            style={{ width: "400px",height:"auto" }}
          />
        </div>
        
        {/* Loading Spinner */}
       
        
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
