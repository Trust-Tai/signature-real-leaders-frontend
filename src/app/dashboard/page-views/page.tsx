"use client";

import React, { useState, useEffect } from 'react';
import { Bell, User, TrendingUp, TrendingDown, Calendar, Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

const PageViews = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    total_page_views: 0,
    unique_visitors: 0,
    pages_per_session: 0,
    monthly_growth_rate: {
      percentage: '0%',
      trend: 'up' as 'up' | 'down'
    }
  });

  useEffect(() => {
    const fetchPageViewStats = async () => {
      try {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          toast.error('Please login to view stats');
          return;
        }

        const response = await api.getPageViewStats(authToken);
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching page view stats:', error);
        toast.error('Failed to load page view statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchPageViewStats();
  }, []);

  const pageViewsData = [
    { page: 'Homepage', views: 2450, change: '+12.5%', trend: 'up' },
    { page: 'About Us', views: 1890, change: '+8.2%', trend: 'up' },
    { page: 'Services', views: 1560, change: '+15.3%', trend: 'up' },
    { page: 'Contact', views: 980, change: '-2.1%', trend: 'down' },
    { page: 'Blog', views: 1340, change: '+22.7%', trend: 'up' },
    { page: 'Portfolio', views: 1120, change: '+5.8%', trend: 'up' },
    { page: 'Testimonials', views: 890, change: '+18.9%', trend: 'up' },
    { page: 'FAQ', views: 670, change: '-1.3%', trend: 'down' }
  ];

  const statsCards = [
    { 
      number: loading ? '...' : statsData.total_page_views.toLocaleString(), 
      label: 'TOTAL PAGE VIEWS', 
      description: 'Total number of times your pages were viewed', 
      color: '#CF3232' 
    },
    { 
      number: loading ? '...' : statsData.unique_visitors.toLocaleString(), 
      label: 'UNIQUE VISITORS', 
      description: 'Individual people who visited your site', 
      color: '#CF3232' 
    },
    { 
      number: loading ? '...' : statsData.pages_per_session.toString(), 
      label: 'PAGES PER SESSION', 
      description: 'Average pages viewed per visit', 
      color: '#CF3232' 
    },
    { 
      number: loading ? '...' : statsData.monthly_growth_rate.percentage, 
      label: 'MONTHLY GROWTH RATE', 
      description: 'Monthly page view change', 
      color: '#CF3232',
      trend: statsData.monthly_growth_rate.trend
    }
  ];

  const timeData = [
    { time: '00:00', views: 120 },
    { time: '04:00', views: 85 },
    { time: '08:00', views: 320 },
    { time: '12:00', views: 580 },
    { time: '16:00', views: 720 },
    { time: '20:00', views: 450 },
    { time: '24:00', views: 180 }
  ];

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="page-views"
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
                Page Views Analytics
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
              {/* Page Views by Page */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Page Views by Page
                </h2>
                
                {/* Mobile View - Cards */}
                <div className="block lg:hidden space-y-3">
                  {pageViewsData.map((page, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[#101117] text-sm">{page.page}</h3>
                        <span className={`text-xs font-medium ${
                          page.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {page.change}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#101117]">{page.views.toLocaleString()}</span>
                        {page.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Page</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Views</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageViewsData.map((page, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-[#101117]">{page.page}</td>
                          <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{page.views.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${
                              page.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {page.change}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {page.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hourly Traffic */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Hourly Traffic Pattern
                </h2>
                
                <div className="space-y-3">
                  {timeData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-12">{data.time}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-[#CF3232] h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(data.views / 720) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-[#101117] w-16 text-right">
                        {data.views}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Peak traffic: 12:00 - 16:00 (1,300 views)
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                Traffic Sources
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">45%</h3>
                  <p className="text-sm text-gray-600">Direct Traffic</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">32%</h3>
                  <p className="text-sm text-gray-600">Organic Search</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">18%</h3>
                  <p className="text-sm text-gray-600">Social Media</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">5%</h3>
                  <p className="text-sm text-gray-600">Referral</p>
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

export default PageViews;
