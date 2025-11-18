"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Users, Menu, Loader2, TrendingUp, Globe, Smartphone, MousePointer, ExternalLink } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { getDashboardStats, DashboardStatistics } from '@/lib/statisticsApi';
import { toast } from '@/components/ui/toast';

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

  // Fetch analytics data
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

  // Calculate metrics
  const pageViewsData = statistics?.audience_demographics || [];
  const deviceData = pageViewsData.reduce((acc, demo) => {
    const device = demo.devices || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationData = pageViewsData.reduce((acc, demo) => {
    const country = demo.countries || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
                Analytics Dashboard
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


        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Time Range Selector */}
            <div className="flex justify-end">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
                <button
                  onClick={() => setTimeRange('7days')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '7days'
                      ? 'bg-[#CF3232] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30days')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '30days'
                      ? 'bg-[#CF3232] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeRange('90days')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '90days'
                      ? 'bg-[#CF3232] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  90 Days
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#CF3232] mb-4 mx-auto" />
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={fetchAnalytics}
                    className="text-red-400 hover:text-red-600 text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    title="Total Page Views"
                    value={statistics?.total_visits || '0'}
                    change="+12.5%"
                    changeType="positive"
                  />
                  <MetricCard
                    icon={<MousePointer className="w-6 h-6" />}
                    title="Total Clicks"
                    value={statistics?.total_link_clicks || '0'}
                    change="+8.3%"
                    changeType="positive"
                  />
                  <MetricCard
                    icon={<Users className="w-6 h-6" />}
                    title="Unique Visitors"
                    value={statistics?.unique_visitors || '0'}
                    change="+15.2%"
                    changeType="positive"
                  />
                  <MetricCard
                    icon={<Globe className="w-6 h-6" />}
                    title="Countries"
                    value={Object.keys(locationData).length.toString()}
                    change="+3"
                    changeType="positive"
                  />
                </div>


                {/* Device Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#101117] mb-4 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-[#CF3232]" />
                      Device Breakdown
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(deviceData).map(([device, count]) => {
                        const total = Object.values(deviceData).reduce((a, b) => a + b, 0);
                        const percentage = ((count / total) * 100).toFixed(1);
                        return (
                          <div key={device} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{device}</span>
                                <span className="text-sm text-gray-500">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#CF3232] h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Geographic Location */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#101117] mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-[#CF3232]" />
                      Top Locations
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(locationData)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([country, count]) => {
                          const total = Object.values(locationData).reduce((a, b) => a + b, 0);
                          const percentage = ((count / total) * 100).toFixed(1);
                          return (
                            <div key={country} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">{country}</span>
                                  <span className="text-sm text-gray-500">{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#CF3232] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>


                {/* Traffic Sources */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#101117] mb-4 flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2 text-[#CF3232]" />
                    Traffic Sources & Lead Generation
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Source</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Visitors</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Page Views</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700">Direct Traffic</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{statistics?.unique_visitors || '0'}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{statistics?.total_visits || '0'}</td>
                          <td className="py-4 px-4 text-sm text-green-600 font-medium">2.5%</td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700">Social Media</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-green-600 font-medium">-</td>
                        </tr>
                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700">Search Engines</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-green-600 font-medium">-</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-700">Referral Links</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-gray-600">-</td>
                          <td className="py-4 px-4 text-sm text-green-600 font-medium">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> UTM parameters and referrer tracking will provide more detailed source attribution. 
                      Add UTM parameters to your shared links for better tracking.
                    </p>
                  </div>
                </div>

                {/* Age Groups & Roles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#101117] mb-4">Age Demographics</h3>
                    <div className="space-y-3">
                      {pageViewsData.map((demo, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-sm font-medium text-gray-700">{demo.age_groups || 'Unknown'}</span>
                          <span className="text-sm text-[#CF3232] font-semibold">{demo.percentage || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#101117] mb-4">Top Professional Roles</h3>
                    <div className="space-y-3">
                      {pageViewsData.map((demo, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-sm font-medium text-gray-700">{demo.top_roles || 'Unknown'}</span>
                          <span className="text-sm text-[#CF3232] font-semibold">{demo.percentage || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <DashBoardFooter />
      </div>
    </div>
  );
};


// Metric Card Component
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, change, changeType }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-red-50 rounded-lg text-[#CF3232]">
        {icon}
      </div>
      <span className={`text-sm font-medium ${
        changeType === 'positive' ? 'text-green-600' : 'text-red-600'
      }`}>
        {change}
      </span>
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-[#CF3232]">{value}</p>
  </div>
);

export default AnalyticsPage;
