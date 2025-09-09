'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, RightImageSection, MainContent, PageHeader, ProfileTemplateSection, Step, MobileMenuToggle } from '@/components';
import { images } from '@/assets';

const ProfileTemplatePage = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const steps: Step[] = [
    { id: 1, title: 'Claim Your Signature', status: 'completed' },
    { id: 2, title: 'Verification', status: 'completed' },
    { id: 3, title: 'Your Information', status: 'completed' },
    { id: 4, title: 'Newsletter Setup', status: 'completed' },
    { id: 5, title: 'Profile Template', status: 'current' },
    { id: 6, title: 'Your Audience', status: 'pending' },
    { id: 7, title: 'Your Success Metrics', status: 'pending' },
    { id: 8, title: 'Your Links', status: 'pending' },
    { id: 9, title: 'Sign', status: 'pending' },
    { id: 10, title: 'Review in Progress', status: 'pending' }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSubmit = () => {
    router.push(`/audience-description`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col xl:flex-row relative">
      <MobileMenuToggle onToggle={toggleMobileMenu} />

      <div className="hidden xl:block xl:w-[320px] xl:flex-shrink-0">
        <Sidebar steps={steps} imageUrl={images.verifyPageLefBgImage} />
      </div>

      <Sidebar 
        steps={steps}
        imageUrl={images.verifyPageLefBgImage}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      <MainContent>
        <div className="flex items-start justify-center min-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-5xl w-full mt-16 sm:mt-20 lg:mt-[40px]">
            <PageHeader
              title="MAKE YOUR MARK"
              subtitle="with RealLeaders signature"
              highlightWord="MARK"
              className='lg:mb-[60px]'
            />
            <ProfileTemplateSection onSubmit={handleSubmit} />
          </div>
        </div>
      </MainContent>

      <RightImageSection 
        imageUrl={images.verifyFirstPageRightBgImage}
        className='h-full'
        style={{ background: 'linear-gradient(180deg, #1C92D2 0%, #F2FCFE 100%)' }}
      />
    </div>
  );
};

export default ProfileTemplatePage;

