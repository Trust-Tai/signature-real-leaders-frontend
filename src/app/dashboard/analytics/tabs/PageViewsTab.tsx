"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { StatsCards } from '@/components';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

const PageViewsTab = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    total_page_views: 0,
    unique_visitors: 0,
    pages_per_session: 0,
    monthly_growth_rate: { percentage: '0%', trend: 'up' as 'up' | 'down' },
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
    { number: loading ? '...' : statsData.total_page_views.toLocaleString(), label: 'TOTAL PAGE VIEWS', description: 'Total number of times your pages were viewed', color: '#CF3232' },
    { number: loading ? '...' : statsData.unique_visitors.toLocaleString(), label: 'UNIQUE VISITORS', description: 'Individual people who visited your site', color: '#CF3232' },
    { number: loading ? '...' : statsData.pages_per_session.toString(), label: 'PAGES PER SESSION', description: 'Average pages viewed per visit', color: '#CF3232' },
    { number: loading ? '...' : statsData.monthly_growth_rate.percentage, label: 'MONTHLY GROWTH RATE', description: 'Monthly page view change', color: '#CF3232', trend: statsData.monthly_growth_rate.trend }
  ];

  const timeData = useMemo(() => {
    if (!statsData.hourly_view_segments || Object.keys(statsData.hourly_view_segments).length === 0) {
      return [
        { time: '00:00', views: 0 }, { time: '04:00', views: 0 }, { time: '08:00', views: 0 },
        { time: '12:00', views: 0 }, { time: '16:00', views: 0 }, { time: '20:00', views: 0 }
      ];
    }

    return Object.entries(statsData.hourly_view_segments)
      .map(([time, views]) => ({ time, views }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [statsData.hourly_view_segments]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#101117]">Page Views Analytics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <StatsCards stats={statsCards} columns={4} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">Hourly Traffic Pattern</h2>
        
        <div className="space-y-3">
          {timeData.map((data, index) => {
            const maxViews = Math.max(...timeData.map(d => d.views), 1);
            const widthPercentage = (data.views / maxViews) * 100;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-12">{data.time}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className="bg-[#CF3232] h-3 rounded-full transition-all duration-300" style={{ width: `${widthPercentage}%` }}></div>
                </div>
                <span className="text-sm font-medium text-[#101117] w-16 text-right">{data.views}</span>
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
  );
};

export default PageViewsTab;
