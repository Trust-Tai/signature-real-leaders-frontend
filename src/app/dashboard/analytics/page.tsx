"use client";

import React, { useState } from 'react';
import { Search, Bell, Users, Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

// Import tab components
import DashboardTab from './tabs/DashboardTab';
import PageViewsTab from './tabs/PageViewsTab';
import PageClicksTab from './tabs/PageClicksTab';
import MembersTab from './tabs/MembersTab';

type TabType = 'dashboard' | 'page-views' | 'page-clicks' | 'members';

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard' },
    { id: 'page-views' as TabType, label: 'Page Views' },
    { id: 'page-clicks' as TabType, label: 'Page Clicks' },
    { id: 'members' as TabType, label: 'Members' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'page-views':
        return <PageViewsTab />;
      case 'page-clicks':
        return <PageClicksTab />;
      case 'members':
        return <MembersTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="analytics"
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
                Analytics
              </h1>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search analytics..." 
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 focus:border-[#CF3232]/30 transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#CF3232] text-[#CF3232]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </main>

        <DashBoardFooter />
      </div>
    </div>
  );
};

export default AnalyticsPage;
