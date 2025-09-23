'use client';

import React, { useState } from 'react';
import {
  Sidebar,
  RightImageSection,
  MainContent,
  PageHeader,
  ClaimSection,
  EmailVerificationSection,
  CodeVerificationSection,
  InformationFormSection,
  NewsletterSetupSection,
  ProfileTemplateSection,
  AudienceDescriptionSection,
  SuccessMetricsSection,
  LinksSection,
  SignSection,
  VerificationReviewSection,
  Step,
  MobileSidebarToggle
} from '@/components';
import { images } from "../../assets/index";

const ProfileVerificationPage = () => {
 
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  
  // Form data state for all steps
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    verificationCode: '',
    // Add other form fields as needed
  });

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Verification', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, title: 'Your Information', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, title: 'Newsletter Setup', status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending' },
    { id: 5, title: 'Profile Template', status: currentStep === 5 ? 'current' : currentStep > 5 ? 'completed' : 'pending' },
    { id: 6, title: 'Your Audience', status: currentStep === 6 ? 'current' : currentStep > 6 ? 'completed' : 'pending' },
    { id: 7, title: 'Your Success Metrics', status: currentStep === 7 ? 'current' : currentStep > 7 ? 'completed' : 'pending' },
    { id: 8, title: 'Your Links', status: currentStep === 8 ? 'current' : currentStep > 8 ? 'completed' : 'pending' },
    { id: 9, title: 'Sign', status: currentStep === 9 ? 'current' : currentStep > 9 ? 'completed' : 'pending' },
    { id: 10, title: 'Review in Progress', status: currentStep === 10 ? 'current' : 'pending' }
  ];

  const nextStep = () => {
    console.log('nextStep called, current step:', currentStep);
    if (currentStep < 10) {
      const newStep = currentStep + 1;
      console.log('Setting new step to:', newStep);
      setCurrentStep(newStep);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderCurrentStep = () => {
    console.log('renderCurrentStep called with currentStep:', currentStep);
    switch (currentStep) {
      case 1:
        return (
          <ClaimSection
            title="CLAIM YOUR SIGNATURE"
            placeholder="Enter your name..."
            value={formData.name}
            onChange={(name) => setFormData(prev => ({ ...prev, name }))}
            onVerify={(name) => {
              console.log('Verifying name:', name);
              console.log('Current step before next:', currentStep);
              if (name !== "") {
                nextStep();
                console.log('Moving to next step');
              }
            }}
            buttonText="VERIFY"
          />
        );
      
      case 2:
        if (showCodeVerification) {
          return (
            <CodeVerificationSection
              onVerify={(code) => {
                setFormData(prev => ({ ...prev, verificationCode: code }));
                if (code && code.length === 6) {
                  nextStep();
                }
              }}
              onResendCode={() => {
                setShowCodeVerification(false);
              }}
            />
          );
        } else {
          return (
            <EmailVerificationSection
              onSendCode={(email) => {
                console.log("email", email);
                setFormData(prev => ({ ...prev, email }));
                if (email !== "") {
                  // Show code verification
                  setShowCodeVerification(true);
                }
              }}
            />
          );
        }
      
      case 3:
        return (
          <InformationFormSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 4:
        return (
          <NewsletterSetupSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 5:
        return (
          <ProfileTemplateSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 6:
        return (
          <AudienceDescriptionSection
            onSubmit={(description) => {
              console.log('Audience description submitted:', description);
              nextStep();
            }}
          />
        );
      
      case 7:
        return (
          <SuccessMetricsSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 8:
        return (
          <LinksSection
            onSubmit={(links) => {
              console.log('Links submitted:', links);
              nextStep();
            }}
          />
        );
      
      case 9:
        return (
          <SignSection
            onSubmit={() => {
              nextStep();
            }}
          />
        );
      
      case 10:
        return (
          <VerificationReviewSection
          />
        );
      
      default:
        return (
          <ClaimSection
            title="CLAIM YOUR SIGNATURE"
            placeholder="Enter your name..."
            onVerify={(name) => {
              console.log('Verifying name:', name);
              if (name !== "") {
                nextStep();
              }
            }}
            buttonText="VERIFY"
          />
        );
    }
  };

  const getRightImage = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 2.5:
        return images.verifyFirstPageRightBgImage;
      case 3:
      case 6:
        return images.comboInfoAudSideBarImage;
      case 4:
        return images.verifyFirstPageRightBgImage;
      case 5:
        return images.verifyFirstPageRightBgImage;
      case 7:
        return images.successMetrixRightSideImage;
      case 8:
        return images.linkRightSideImge;
      case 9:
        return images.signRightImage;
      case 10:
        return images.verifyFirstPageRightBgImage;
      default:
        return images.verifyFirstPageRightBgImage;
    }
  };

  const getRightImageStyle = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 2.5:
      case 4:
      case 5:
      case 10:
        return {
          background: 'linear-gradient(180deg, #1C92D2 0%, #F2FCFE 100%)'
        };
      case 3:
      case 6:
        return {
          background: 'linear-gradient(180deg, #4AC29A 0%, #BDFFF3 100%)'
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
      {/* Mobile Sidebar Toggle - Only show when sidebar is closed */}
      {!isMobileMenuOpen && (
        <MobileSidebarToggle onToggle={toggleMobileMenu} />
      )}

      {/* Section 1: Left Sidebar - Hidden on mobile/tablet, shown on desktop */}
      <div className="">
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
          <div className={`w-full mt-16 sm:mt-20 lg:mt-[40px] ${
            currentStep === 3 || currentStep === 7 || currentStep === 5? 'max-w-[870px]' : 'max-w-2xl'
          }`}>
            {/* Header */}
           {currentStep !== 10 && (
  <PageHeader
    title="MAKE YOUR MARK"
    subtitle="with RealLeaders signature"
    highlightWord="MARK"
    className={`lg:mb-[${currentStep === 1 ? '150px' : currentStep === 3 ? '80px' : currentStep === 5 ? '60px' : currentStep === 6 ? '100px' : currentStep === 7 ? '130px' : '90px'}]`}
  />
)}


            {/* Current Step Component */}
            {renderCurrentStep()}
          </div>
        </div>
      </MainContent>

      {/* Section 3: Right Image Section - Hidden on mobile/tablet, shown on desktop */}
      <RightImageSection
        imageUrl={getRightImage()}
        className='h-full'
        style={getRightImageStyle()}
      />
    </div>
  );
};

export default ProfileVerificationPage;
