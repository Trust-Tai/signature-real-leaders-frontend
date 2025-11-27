"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatsCards } from '@/components';
import { getDashboardStats, DashboardStatistics } from '@/lib/statisticsApi';
import { toast } from '@/components/ui/toast';

const DashboardTab = () => {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const statsResponse = await getDashboardStats(token);
      
      if (statsResponse.success) {
        setStatistics(statsResponse.statistics);
      } else {
        setError('Failed to fetch analytics');
        toast.error('Failed to load analytics data');
      }
    } catch (err) {
      console.error('[Analytics] Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error loading analytics: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const statsCards = useMemo(() => {
    if (!statistics) {
      return [
        { number: '0', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page Was Viewed', color: '#CF3232' },
        { number: '0', label: 'PAGE CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' },
        { number: '0', label: 'NEWSLETTER SUBSCRIBERS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
        { number: '0', label: 'VERIFIED MEMBERS', description: 'People Following Your Profile', color: '#CF3232' }
      ];
    }

    return [
      { number: statistics.total_visits || '0', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page Was Viewed', color: '#CF3232' },
      { number: statistics.total_link_clicks || '0', label: 'PAGE CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' },
      { number: statistics.total_contacts?.toString() || '0', label: 'NEWSLETTER SUBSCRIBERS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
      { number: statistics.total_bookings?.toString() || '0', label: 'VERIFIED MEMBERS', description: 'People Following Your Profile', color: '#CF3232' }
    ];
  }, [statistics]);

  const demographicsData = useMemo(() => {
    if (!statistics || !statistics.audience_demographics || statistics.audience_demographics.length === 0) {
      return [{ country: 'No Data', device: 'No Data', percentage: '0%' }];
    }

    return statistics.audience_demographics.map(demo => ({
      country: demo.countries || 'Unknown',
      device: demo.devices || 'Unknown',
      percentage: `${demo.percentage || 0}%`
    }));
  }, [statistics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#CF3232] mb-4 mx-auto" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <button onClick={fetchAnalytics} className="text-red-400 hover:text-red-600 text-sm underline">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <StatsCards stats={statsCards} columns={4} />

      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Today&apos;s Visits</h3>
            <p className="text-3xl font-bold text-[#CF3232]">{statistics.today_visits || '0'}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Unique Visitors</h3>
            <p className="text-3xl font-bold text-[#CF3232]">{statistics.unique_visitors || '0'}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">This Week</h3>
            <p className="text-3xl font-bold text-[#CF3232]">{statistics.this_week_visits?.length || '0'}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-[#CF3232]">{statistics.this_month_visits?.length || '0'}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-5 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#101117]">Analytics Overview</h2>
          {statistics && (
            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
              Based on {statistics.total_visits} total visits
            </span>
          )}
        </div>
        
        <div className="block sm:hidden space-y-4">
          {demographicsData.map((row, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500 text-xs">Country:</span><div className="font-medium text-gray-700">{row.country}</div></div>
                <div><span className="text-gray-500 text-xs">Device:</span><div className="font-medium text-gray-700">{row.device}</div></div>
                <div className="col-span-2 mt-2"><span className="text-gray-500 text-xs">Percentage:</span><div className="font-bold text-[#CF3232] text-lg">{row.percentage}</div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Top Countries</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Devices</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {demographicsData.map((row, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-2 text-sm sm:text-base font-outfit text-[#414141]">{row.country}</td>
                  <td className="py-4 px-2 text-sm sm:text-base font-outfit text-[#414141]">{row.device}</td>
                  <td className="py-4 px-2 text-sm font-semibold text-[#101117]">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left font-medium">
            Showing {demographicsData.length} demographic {demographicsData.length === 1 ? 'entry' : 'entries'}
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-4 py-2 bg-[#CF3232] text-white rounded-lg text-sm font-medium shadow-sm">1</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
