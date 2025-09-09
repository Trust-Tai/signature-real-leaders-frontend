'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  NewsletterSetupSection,
  Step,
  MobileMenuToggle
} from '@/components';
import { images } from "../../assets/index";
import { useRouter } from "next/navigation";

const NewsletterSetupPage = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = () => {
    router.push("/profile-template");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: 'completed' },
    { id: 2, title: 'Verification', status: 'completed' },
    { id: 3, title: 'Your Information', status: 'completed' },
    { id: 4, title: 'Newsletter Setup', status: 'current' },
    { id: 5, title: 'Profile Template', status: 'pending' },
    { id: 6, title: 'Your Audience', status: 'pending' },
    { id: 7, title: 'Your Success Metrics', status: 'pending' },
    { id: 8, title: 'Your Links', status: 'pending' },
    { id: 9, title: 'Sign', status: 'pending' },
    { id: 10, title: 'Review in Progress', status: 'pending' }
  ];

  return (
    <div className="min-h-screen flex flex-col xl:flex-row relative" style={{ background: '#f9efef' }}>
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle onToggle={toggleMobileMenu} />

      {/* Section 1: Left Sidebar - Hidden on mobile/tablet, shown on desktop */}
      <div className="hidden xl:block xl:w-[320px] xl:flex-shrink-0">
        <Sidebar 
          steps={steps} 
          imageUrl={images.verifyPageLefBgImage}
        />
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
          <div className="max-w-[870px] w-full mt-16 sm:mt-20 lg:mt-[40px]">
            {/* Header */}
            <PageHeader
              title="MAKE YOUR MARK"
              subtitle="with RealLeaders signature"
              highlightWord="MARK"
              className='lg:mb-[90px]'
            />

            {/* Newsletter Setup Section */}
            <NewsletterSetupSection onSubmit={handleSubmit} />
          </div>
        </div>
      </MainContent>

      {/* Section 3: Right Image Section - Hidden on mobile/tablet, shown on desktop */}
      <RightImageSection 
        imageUrl={images.comboInfoAudSideBarImage}
        className='h-full'
        style={{
          background: 'linear-gradient(180deg, #4AC29A 0%, #BDFFF3 100%)'
        }}
      />
    </div>
  );
};

export default NewsletterSetupPage;


