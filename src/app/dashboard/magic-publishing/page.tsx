"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Menu, Users, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import ContentGenerator from '@/components/ui/ContentGenerator';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { DashboardTour } from '@/components/ui/DashboardTour';
import { WelcomeModal } from '@/components/ui/WelcomeModal';
import { useUser } from '@/components/UserContext';

const MagicPublishingPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Check access
  const ALLOWED_EMAIL = 'tayeshobajo@gmail.com';
  const hasAccess = user?.email === ALLOWED_EMAIL;

  // Check if user should see welcome modal and tour
  useEffect(() => {
    const checkTourStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // Fetch user details to check tour_guide status
        const { api } = await import('@/lib/api');
        const userResponse = await api.getUserDetails(token);
        
        if (userResponse.success && userResponse.user) {
          const tourGuideStatus = userResponse.user.tour_guide;
          
          console.log('[Magic Publishing] Tour guide status from API:', tourGuideStatus);
          
          // Show welcome modal if tour_guide is false (first time user)
          if (!tourGuideStatus) {
            console.log('[Magic Publishing] First time user, showing welcome modal with tour guide');
            setShowWelcomeModal(true);
          }
          
          // Update localStorage with user data
          localStorage.setItem('user_data', JSON.stringify(userResponse.user));
        }
      } catch (error) {
        console.error('[Magic Publishing] Error checking tour status:', error);
      }
    };

    checkTourStatus();
  }, []);

  const handleStartTour = useCallback(() => {
    setShowTour(true);
  }, []);

  const handleWelcomeModalClose = useCallback(async () => {
    setShowWelcomeModal(false);
    
    // Update tour_guide status in API when user closes/skips modal
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const { api } = await import('@/lib/api');
        await api.updateTourGuideStatus(token);
        console.log('[Magic Publishing] Tour guide status updated to true');
        
        // Update user_data in localStorage
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.tour_guide = true;
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('[Magic Publishing] Error updating tour guide status:', error);
    }
  }, []);

  const handleTourComplete = useCallback(async () => {
    setShowTour(false);
    
    // Update tour_guide status in API when tour completes
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const { api } = await import('@/lib/api');
        await api.updateTourGuideStatus(token);
        console.log('[Magic Publishing] Tour guide status updated to true after completion');
        
        // Update user_data in localStorage
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.tour_guide = true;
          localStorage.setItem('user_data', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('[Magic Publishing] Error updating tour guide status:', error);
    }
  }, []);

  // Show Coming Soon overlay for non-allowed users
  if (user && !hasAccess) {
    return (
      <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <UserProfileSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="magic-publishing"
        />
        
        {/* Full Screen Coming Soon Overlay */}
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center space-y-4 p-8 max-w-lg">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 mb-4">
              <Lock className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-xl leading-relaxed">
              Magic Publishing feature is currently in development and will be available soon.
            </p>
           
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal 
          onStartTour={handleStartTour}
          onClose={handleWelcomeModalClose}
        />
      )}

      {/* Tour Guide */}
      {showTour && <DashboardTour onComplete={handleTourComplete} />}

      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Magic Publishing
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
              </div>
              
              {/* Notifications and Profile Icons */}
              <div className="flex items-center space-x-4">
                
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="sm:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search here..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
                style={{ color: '#949494' }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <ContentGenerator />
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default MagicPublishingPage;
