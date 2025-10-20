


"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, Menu, Users } from 'lucide-react';
import { UserProfileSidebar, StatsCards } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoize static data to prevent unnecessary re-renders
  const statsCards = useMemo(() => [
    { number: '50', label: 'BOOKINGS', description: 'New Meetings, Consultations, Or Events Scheduled', color: '#CF3232' },
    { number: '3,220', label: 'CONTACTS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
    { number: '9,475', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page', color: '#CF3232' },
    { number: '2,183', label: 'LINK CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' }
  ], []);

  const demographicsData = useMemo(() => [
    { country: 'United States', device: 'Desktop', age: '25-34', role: 'Coaches', percentage: '58%' },
    { country: 'United Kingdom', device: 'Mobile', age: '35-44', role: 'Entrepreneurs', percentage: '20%' },
    { country: 'Canada', device: 'Desktop', age: '45-54', role: 'Marketing Directors', percentage: '72%' },
    { country: 'India', device: 'Mobile', age: '25-34', role: 'Nonprofit Leaders', percentage: '33%' },
    { country: 'Other', device: 'Desktop', age: '18-24', role: 'Coaches', percentage: '8%' }
  ], []);

  // Memoize callback functions
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);


  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="dashboard"
      />


      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={handleSidebarToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Signature Dashboard
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
          
          {/* Mobile Search and Tour Button */}
          <div className="sm:hidden mt-4 space-y-3">
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
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8">
              
                            {/* Stats Cards */}
              <div>
                <StatsCards stats={statsCards} columns={4} />
              </div>
              {/* Audience Demographics */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4 sm:mb-6">
                  Audience Demographics
                </h2>
                
                {/* Mobile Table - Stacked Cards */}
                <div className="block sm:hidden space-y-4">
                  {demographicsData.map((row, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Country:</span>
                          <div className="font-medium text-gray-700">{row.country}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Device:</span>
                          <div className="font-medium text-gray-700">{row.device}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Age:</span>
                          <div className="font-medium text-gray-700">{row.age}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Role:</span>
                          <div className="font-medium text-gray-700">{row.role}</div>
                        </div>
                        <div className="col-span-2 mt-2">
                          <span className="text-gray-500 text-xs">Percentage:</span>
                          <div className="font-bold text-[#CF3232] text-lg">{row.percentage}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Top Countries</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Devices</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Age Groups</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Top Roles</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demographicsData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.country}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.device}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.age}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.role}</td>
                          <td className="py-4 px-2 text-sm font-semibold text-[#101117]">{row.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    Showing 1 to 8 of 16 Entries
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="px-3 py-1 bg-[#CF3232] text-white rounded text-sm">1</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">2</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">3</span>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Footer */}
          <footer className="flex items-center justify-center lg:justify-end px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white h-[131px]">
            <div className="text-xs sm:text-sm text-center">
              © 2025 RealLeaders. All Rights Reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;