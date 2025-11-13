"use client";

import React, { useState, useEffect } from 'react';
import { Bell, User, Calendar, Menu } from 'lucide-react';
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
    },
    hourly_view_segments: {} as { [key: string]: number }
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

  // Convert hourly_view_segments to array format for display
  const timeData = React.useMemo(() => {
    if (!statsData.hourly_view_segments || Object.keys(statsData.hourly_view_segments).length === 0) {
      // Default data if API doesn't return hourly segments
      return [
        { time: '00:00', views: 0 },
        { time: '04:00', views: 0 },
        { time: '08:00', views: 0 },
        { time: '12:00', views: 0 },
        { time: '16:00', views: 0 },
        { time: '20:00', views: 0 }
      ];
    }

    // Convert object to array and sort by time
    return Object.entries(statsData.hourly_view_segments)
      .map(([time, views]) => ({ time, views }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [statsData.hourly_view_segments]);

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

            {/* Hourly Traffic Section */}
            <div>
              {/* Hourly Traffic */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Hourly Traffic Pattern
                </h2>
                
                <div className="space-y-3">
                  {timeData.map((data, index) => {
                    const maxViews = Math.max(...timeData.map(d => d.views), 1); // Avoid division by zero
                    const widthPercentage = (data.views / maxViews) * 100;
                    
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-12">{data.time}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-[#CF3232] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${widthPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-[#101117] w-16 text-right">
                          {data.views}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    {timeData.length > 0 && (() => {
                      const maxViews = Math.max(...timeData.map(d => d.views));
                      const peakTime = timeData.find(d => d.views === maxViews);
                      return peakTime ? `Peak traffic: ${peakTime.time} (${maxViews.toLocaleString()} views)` : 'No traffic data available';
                    })()}
                  </p>
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
