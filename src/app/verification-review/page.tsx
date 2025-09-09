'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  MainContent,
  VerificationReviewSection,
  Step,
  MobileMenuToggle
} from '@/components';
import { images } from "../../assets/index";

const VerificationReviewPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: 'completed' },
    { id: 2, title: 'Verification', status: 'completed' },
    { id: 3, title: 'Your Information', status: 'completed' },
    { id: 4, title: 'Newsletter Setup', status: 'completed' },
    { id: 5, title: 'Profile Template', status: 'completed' },
    { id: 6, title: 'Your Audience', status: 'completed' },
    { id: 7, title: 'Your Success Metrics', status: 'completed' },
    { id: 8, title: 'Your Links', status: 'completed' },
    { id: 9, title: 'Sign', status: 'completed' },
    { id: 10, title: 'Review in Progress', status: 'current' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle onToggle={toggleMobileMenu} />

      {/* Section 1: Left Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden xl:block xl:w-[320px] xl:flex-shrink-0">
        <Sidebar 
          steps={steps} 
          imageUrl={images.verifyPageLefBgImage}
        />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <Sidebar 
        steps={steps} 
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Section 2: Main Content - Takes remaining width (no right section) */}
      <MainContent>
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-3xl w-full">
            {/* Verification Review Section */}
            <VerificationReviewSection />
             
          </div>
        </div>
      </MainContent>
     
    </div>
  );
};

export default VerificationReviewPage;

