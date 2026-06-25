"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import NewsletterSubscribersPanel from '@/components/ui/NewsletterSubscribersPanel';

const EmailSubscribers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>

      <UserProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="email-subscribers"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">

        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Newsletter Subscribers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <NewsletterSubscribersPanel />
        </main>

        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default EmailSubscribers;
