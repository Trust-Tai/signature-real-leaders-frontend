"use client";

import React, { useState } from 'react';
import {  Bell, User, Menu,  Calendar, Users, Globe, Monitor, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfileSidebar, StatsCards } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

const AudienceDemographics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  


  const demographicsData = [
    { country: 'United States', device: 'Desktop', age: '25-34', role: 'Coaches', percentage: '58%', change: '+12.5%' },
    { country: 'United Kingdom', device: 'Mobile', age: '35-44', role: 'Entrepreneurs', percentage: '20%', change: '+8.2%' },
    { country: 'Canada', device: 'Desktop', age: '45-54', role: 'Marketing Directors', percentage: '72%', change: '+15.3%' },
    { country: 'India', device: 'Mobile', age: '25-34', role: 'Nonprofit Leaders', percentage: '33%', change: '+22.7%' },
    { country: 'Australia', device: 'Desktop', age: '35-44', role: 'Consultants', percentage: '18%', change: '+5.8%' },
    { country: 'Germany', device: 'Mobile', age: '45-54', role: 'Executives', percentage: '15%', change: '+18.9%' },
    { country: 'France', device: 'Desktop', age: '25-34', role: 'Managers', percentage: '12%', change: '+7.6%' },
    { country: 'Other', device: 'Mixed', age: '18-24', role: 'Students', percentage: '8%', change: '-1.3%' }
  ];

  const statsCards = [
    { number: '2,847', label: 'UNIQUE VISITORS', description: 'Individual people who visited your site', color: '#CF3232' },
    { number: '45', label: 'COUNTRIES', description: 'Geographic diversity of your audience', color: '#CF3232' },
    { number: '68%', label: 'MOBILE USERS', description: 'Percentage using mobile devices', color: '#CF3232' },
    { number: '32.5', label: 'AVG AGE', description: 'Average age of your audience', color: '#CF3232' }
  ];

  const deviceData = [
    { device: 'Mobile', percentage: 68, users: 1936 },
    { device: 'Desktop', percentage: 28, users: 797 },
    { device: 'Tablet', percentage: 4, users: 114 }
  ];

  const ageData = [
    { age: '18-24', percentage: 12, users: 342 },
    { age: '25-34', percentage: 38, users: 1082 },
    { age: '35-44', percentage: 28, users: 797 },
    { age: '45-54', percentage: 16, users: 456 },
    { age: '55+', percentage: 6, users: 171 }
  ];

  const roleData = [
    { role: 'Coaches', percentage: 25, users: 712 },
    { role: 'Entrepreneurs', percentage: 22, users: 626 },
    { role: 'Marketing Directors', percentage: 18, users: 512 },
    { role: 'Nonprofit Leaders', percentage: 15, users: 427 },
    { role: 'Consultants', percentage: 12, users: 342 },
    { role: 'Other', percentage: 8, users: 228 }
  ];

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="audience-demographics"
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
                Audience Demographics
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="hidden sm:flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span> */}
                </div>
                <div className="relative">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span> */}
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
          {/* Mobile Date Range */}
          <div className="sm:hidden mt-4">
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Stats Cards */}
            <StatsCards stats={statsCards} columns={4} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Usage */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-[#CF3232]" />
                  Device Usage
                </h2>
                
                <div className="space-y-4">
                  {deviceData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-16">{data.device}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#CF3232] h-4 rounded-full transition-all duration-300"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2 w-24">
                        <span className="text-sm font-medium text-[#101117]">
                          {data.percentage}%
                        </span>
                        <span className="text-xs text-gray-500">
                          ({data.users})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#CF3232]" />
                  Age Distribution
                </h2>
                
                <div className="space-y-4">
                  {ageData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-16">{data.age}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#CF3232] h-4 rounded-full transition-all duration-300"
                          style={{ width: `${data.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2 w-24">
                        <span className="text-sm font-medium text-[#101117]">
                          {data.percentage}%
                        </span>
                        <span className="text-xs text-gray-500">
                          ({data.users})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Role Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#CF3232]" />
                Professional Roles
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleData.map((data, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#101117] text-sm">{data.role}</h3>
                      <span className="text-lg font-bold text-[#CF3232]">{data.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#CF3232] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{data.users} users</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Demographics Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-[#CF3232]" />
                  Geographic & Demographic Breakdown
                </h2>
              </div>
              
              {/* Mobile View - Cards */}
              <div className="block sm:hidden p-4 space-y-4">
                {demographicsData.slice(0, 4).map((row, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#101117]">{row.country}</h3>
                      <span className="text-lg font-bold text-[#CF3232]">{row.percentage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
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
                      <div>
                        <span className="text-gray-500 text-xs">Change:</span>
                        <div className={`font-medium ${
                          row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {row.change}
                        </div>
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
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Top Countries</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Devices</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Age Groups</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Top Roles</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">% of Total</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demographicsData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-[#101117]">{row.country}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{row.device}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{row.age}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{row.role}</td>
                        <td className="py-4 px-4 text-sm font-semibold text-[#101117]">{row.percentage}</td>
                        <td className="py-4 px-4">
                          <span className={`text-sm font-medium ${
                            row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {row.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    Showing 1 to 8 of 45 countries
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
        </main>
        
        {/* Fixed Footer */}
         <DashBoardFooter />
      </div>
    </div>
  );
};

export default AudienceDemographics;
