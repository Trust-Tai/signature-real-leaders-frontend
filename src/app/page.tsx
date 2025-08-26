'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  ClaimSection,
  Step,
  MobileSidebarToggle
} from '@/components';
import { useRouter } from "next/navigation";
import {images} from "../assets/index"

const Home = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleVerify = (inputName: string) => {
    console.log('Verifying name:', inputName);
    if(inputName !== ""){
      router.push("/email-verification");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: 'current' },
    { id: 2, title: 'Verification', status: 'pending' },
    { id: 3, title: 'Your Information', status: 'pending' },
    { id: 4, title: 'Your Audience', status: 'pending' },
    { id: 5, title: 'Your Success Metrics', status: 'pending' },
    { id: 6, title: 'Your Links', status: 'pending' },
    { id: 7, title: 'Sign', status: 'pending' },
    { id: 8, title: 'Review in Progress', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
      {/* Mobile Sidebar Toggle - Only show when sidebar is closed */}
      {!isMobileMenuOpen && (
        <MobileSidebarToggle onToggle={toggleMobileMenu} />
      )}

      {/* Section 1: Left Sidebar - Hidden on mobile/tablet, shown on desktop */}
      <div className="hidden xl:block xl:w-[320px] xl:flex-shrink-0">
        <Sidebar steps={steps} imageUrl={images.verifyPageLefBgImage}/>
      </div>

      {/* Mobile/Tablet Sidebar - Overlay */}
      <Sidebar 
        steps={steps} 
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Section 2: Middle Content - Takes remaining width */}
      <MainContent>
        <div className="flex items-start justify-center min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-2xl w-full mt-16 sm:mt-20 lg:mt-[110px]">
            {/* Header */}
            <PageHeader
              title="MAKE YOUR MARK"
              subtitle="with RealLeaders signature"
              highlightWord="MARK"
               className='lg:mb-[150px]'
            />

            {/* Claim Section */}
            <ClaimSection
              title="CLAIM YOUR SIGNATURE"
              placeholder="Enter your name..."
              value={name}
              onChange={setName}
              onVerify={handleVerify}
              buttonText="VERIFY"
            />
          </div>
        </div>
      </MainContent>

      {/* Section 3: Right Image Section - Hidden on mobile/tablet, shown on desktop */}
      <RightImageSection
       imageUrl={images.verifyFirstPageRightBgImage}
        className='h-full'
        style={{
    background: 'linear-gradient(180deg, #1C92D2 0%, #F2FCFE 100%)'
  }}
       />
    </div>
  );
};

export default Home;
