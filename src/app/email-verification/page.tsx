'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  EmailVerificationSection,
  Step,
  CodeVerificationSection,
  MobileMenuToggle
} from '@/components';
import { useRouter } from "next/navigation";

import {images} from "../../assets/index"
const EmailVerificationPage = () => {
    const router = useRouter();
    const [checkMail,setCheckMail] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSendCode = (email: string) => {
    console.log("email",email)
    if(email !==""){
      setCheckMail(true)
    }
  }
  
   const handleVerify = (code: string) => {
    if(code && code.length == 6){
      router.push("/information-form")
    }
  };

 
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: 'completed' },
    { id: 2, title: 'Verification', status: 'current' },
    { id: 3, title: 'Your Information', status: 'pending' },
    { id: 4, title: 'Your Audience', status: 'pending' },
    { id: 5, title: 'Your Success Metrics', status: 'pending' },
    { id: 6, title: 'Your Links', status: 'pending' },
    { id: 7, title: 'Sign', status: 'pending' },
    { id: 8, title: 'Review in Progress', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
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
          <div className="max-w-2xl w-full mt-16 sm:mt-20 lg:mt-[110px]">
            {/* Header */}
            <PageHeader
              title="MAKE YOUR MARK"
              subtitle="with RealLeaders signature"
              highlightWord="MARK"
              className='lg:mb-[150px]'
            />

            {/* Email Verification Section */}
            {checkMail ? 
              <CodeVerificationSection
                onVerify={handleVerify}
                onResendCode={function (): void {
                  throw new Error('Function not implemented.');
                }} 
              /> : 
              <EmailVerificationSection
                onSendCode={handleSendCode}
              />
            }
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

export default EmailVerificationPage;
