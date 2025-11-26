"use client";

import React, { useState } from 'react';
import { Search, Menu, Mic, Plus, ArrowLeft } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter } from 'next/navigation';

const MagicPublishingPodcasts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-podcasts"
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
              
              {/* Back Arrow */}
              <button
                onClick={() => router.push('/dashboard/magic-publishing')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Back to Content Generator"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#CF3232] transition-colors" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Magic Publishing (Podcasts)
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
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Magic Publishing Header */}
          

            {/* Podcast Ideas & Content Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#101117]">Podcast Ideas & Content</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create New Podcast</span>
                </button>
              </div>

              {/* No Podcasts State */}
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <Mic className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-[#101117] mb-2">No Podcasts Yet</h4>
                <p className="text-gray-500 text-center max-w-md">
                  Create your first podcast by clicking the button above.
                </p>
              </div>
            </div>

          </div>
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default MagicPublishingPodcasts;
