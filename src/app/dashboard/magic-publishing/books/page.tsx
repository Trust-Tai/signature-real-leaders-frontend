"use client";

import React, { useState } from 'react';
import { Search, Bell, Menu, Users, Globe, BookOpen, Mic, Plus, Info } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter } from 'next/navigation';

const MagicPublishingBooks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-books"
      />

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
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
                Magic Publishing (Books)
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
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span>
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span>
                </div>
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
            
            {/* Magic Publishing Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-[#101117]">Magic Publishing</h2>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit Details
                </button>
              </div>
              <p className="text-gray-600 mb-6">Generate and manage your content across all platforms.</p>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/setup")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Setup</span>
                </div>
                <div 
                  onClick={()=>router.push("/dashboard/magic-publishing/content")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Content</span>
                </div>
                <div 
                  onClick={()=>router.push("/dashboard/magic-publishing/books")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#CF3232] text-white transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Books</span>
                </div>
                <div 
                  onClick={()=>router.push("/dashboard/magic-publishing/podcasts")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  <span>Podcasts</span>
                </div>
              </div>
            </div>

            {/* Book Ideas & Content Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#101117]">Book Ideas & Content</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create New Book</span>
                </button>
              </div>

              {/* No Books State */}
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-[#101117] mb-2">No Books Yet</h4>
                <p className="text-gray-500 text-center max-w-md">
                  Create your first book by clicking the button above.
                </p>
              </div>
            </div>

          </div>
          
          {/* Footer */}
          <DashBoardFooter />
        </main>
      </div>
    </div>
  );
};

export default MagicPublishingBooks;
