"use client";

import React, { useState } from 'react';
import { Menu, Users } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

const CommunityPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="community"
      />

      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        {/* Header */}
        <header className="bg-white px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <h1 className="text-[#101117] text-lg sm:text-xl lg:text-2xl font-bold">
                Join Community
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Coming Soon Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#CF3232]/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-[#CF3232]" />
              </div>

              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#CF3232]/20 text-[#CF3232] mb-4 font-medium tracking-wide">
                Add On
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#101117] mb-3">
                Coming Soon
              </h2>
              <p className="text-gray-500 leading-relaxed">
                The Community is on its way. Soon you&apos;ll be able to connect with other
                leaders, join the conversation, and grow your network — all in one place.
              </p>
            </div>
          </div>
        </main>

        <DashBoardFooter />
      </div>
    </div>
  );
};

export default CommunityPage;
