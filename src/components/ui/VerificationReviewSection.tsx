"use client"

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {images} from '../../assets/index'
interface VerificationReviewSectionProps {
  className?: string;
}

const VerificationReviewSection: React.FC<VerificationReviewSectionProps> = ({
  className
}) => {
  return (
    <div className={`min-h-screen flex items-start justify-center p-4 sm:p-8 animate-fade-in-up ${className || ''}`} 
        style={{marginTop:150}} >
      <div className="text-center space-y-6 sm:space-y-8 max-w-2xl px-4">
        
        {/* Target Icon */}
        <div className="flex justify-center mb-8 sm:mb-12 animate-fade-in-down">
           <Image
                    src={images.reviewVerified}
                    alt="Review verified"
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[144px] lg:h-[134px] animate-pulse"
                  />
        </div>

        {/* Main Heading */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight animate-fade-in" 
              style={{ 
                color: '#CF3232',
                fontFamily: "Abolition Test",
                fontStyle: 'normal',
                fontSize: '72px',
                fontWeight:400
              }}>
            YOUR SIGNATURE LINK IS<br />
            UNDER REVIEW
          </h1>
          
          {/* Subtitle Text */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base leading-relaxed font-outfit font-medium animate-fade-in"  style={{ 
                color: '#333333CC'
              }}>
              Your information is under review to ensure verified leadership.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-outfit font-medium animate-fade-in" style={{ 
                color: '#333333'
              }}>
              You will receive an email when your link is available.
            </p>
          </div>
        </div>

        {/* Login Section */}
        <div className="mt-12 sm:mt-16 space-y-6 animate-fade-in">
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4" 
                style={{ 
                  color: '#CF3232',
                  fontFamily: "Abolition Test",
                  fontWeight: 400
                }}>
              ALREADY HAVE AN ACCOUNT?
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 font-outfit font-medium" 
               style={{ color: '#333333CC' }}>
              Sign in to access your dashboard and manage your signature link.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/login"
                className="w-full sm:w-auto px-8 py-3 bg-[#CF3232] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 font-outfit text-center inline-block"
              >
                LOGIN TO DASHBOARD
              </Link>
              
              <span className="text-gray-400 font-outfit">or</span>
              
              <Link 
                href="/"
                className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 font-outfit text-center inline-block"
              >
                BACK TO HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default VerificationReviewSection;