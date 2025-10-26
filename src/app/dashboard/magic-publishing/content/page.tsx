"use client";

import React, { useState } from 'react';
import { Search, Bell, Menu, Users, Globe, BookOpen, Mic, Info, Plus } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import MagicPublishingForm from './components/MagicPublishingForm';
import GeneratedArticlesList from './components/GeneratedContentsList';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter } from 'next/navigation';

const MagicPublishingContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter()
  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-content"
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
                Magic Publishing (Articles)
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

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Magic Publishing Header */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#101117]">Magic Publishing</h2>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto">
                  Edit Details
                </button>
              </div>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Generate and manage your content across all platforms.</p>
              
              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
                <div 
                 onClick={()=>router.push("/dashboard/magic-publishing/setup")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Setup</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/content")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md bg-[#CF3232] text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Content</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/books")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Books</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/podcasts")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Podcasts</span>
                </div>
              </div>
            </div>

            {/* Add Article Button */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-2">
                    Article Generation
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Generate new articles with AI-powered content creation
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Article</span>
                </button>
              </div>
            </div>

            {/* Magic Publishing Form - Only show when showForm is true */}
            {showForm && (
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <MagicPublishingForm onClose={() => setShowForm(false)} />
              </div>
            )}

            {/* Generated Articles List */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <GeneratedArticlesList />
            </div>

          </div>
        </main>
        
        {/* Fixed Footer */}
         <DashBoardFooter />
      </div>
    </div>
  );
};

export default MagicPublishingContent;
