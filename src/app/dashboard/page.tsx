"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, Menu, Users, Loader2 } from 'lucide-react';
import { UserProfileSidebar, StatsCards } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { getDashboardStats, DashboardStatistics } from '@/lib/statisticsApi';
import { toast } from '@/components/ui/toast';
import { DashboardTour } from '@/components/ui/DashboardTour';
import { ProfileCompletionCard } from '@/components/ui/ProfileCompletionCard';
import { WelcomeModal } from '@/components/ui/WelcomeModal';
import { api } from '@/lib/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<{
    percentage: number;
    incomplete_fields: string[];
  } | null>(null);

  // Check account status on mount - FIRST PRIORITY
  useEffect(() => {
    const checkAccountStatus = () => {
      try {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData.account_status === 'pending_review') {
            console.log('[Dashboard] Account pending review, redirecting to login');
            toast.info('Your account is under review. You will be notified once approved.');
            window.location.href = '/login';
            return; // Don't set isCheckingAuth to false, keep showing loading
          }
        }
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('[Dashboard] Error checking account status:', error);
        setIsCheckingAuth(false);
      }
    };

    checkAccountStatus();
  }, []);

  // Fetch dashboard statistics and profile completion - only after auth check passes
  useEffect(() => {
    if (isCheckingAuth) return; // Don't fetch if still checking auth
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        // Fetch dashboard statistics
        const statsResponse = await getDashboardStats(token);
        
        if (statsResponse.success) {
          setStatistics(statsResponse.statistics);
          console.log('[Dashboard] Statistics loaded:', statsResponse.statistics);
        } else {
          setError('Failed to fetch statistics');
          toast.error('Failed to load dashboard statistics');
        }

        // Fetch user details to get profile completion status
        try {
          const userResponse = await api.getUserDetails(token);
          console.log('[Dashboard] User details response:', userResponse);
          
          if (userResponse.success && userResponse.profile_completion) {
            const completion = userResponse.profile_completion;
            setProfileCompletion({
              percentage: completion.percentage,
              incomplete_fields: completion.missing_fields,
            });
            
            console.log('[Dashboard] Profile completion:', completion);
            
            // Show welcome modal for first-time users
            const tourCompleted = localStorage.getItem('dashboard_tour_completed');
            const welcomeShown = localStorage.getItem('welcome_modal_shown');
            
            if (tourCompleted !== 'true' && welcomeShown !== 'true') {
              console.log('[Dashboard] Showing welcome modal for first-time user');
              setShowWelcomeModal(true);
            } else if (completion.percentage < 100) {
              // Show profile completion card if tour is already done but profile incomplete
              console.log('[Dashboard] Showing profile completion card');
              setShowProfileCard(true);
            }
          } else {
            console.log('[Dashboard] No profile completion data in response');
          }
        } catch (err) {
          console.error('[Dashboard] Error fetching user details for profile completion:', err);
          // Don't show error toast for profile completion - it's not critical
        }
      } catch (err) {
        console.error('[Dashboard] Error fetching statistics:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        toast.error(`Error loading statistics: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isCheckingAuth]);

  // Memoize dynamic stats cards based on API data
  const statsCards = useMemo(() => {
    if (!statistics) {
      return [
        { number: '0', label: 'BOOKINGS', description: 'New Meetings, Consultations, Or Events Scheduled', color: '#CF3232' },
        { number: '0', label: 'CONTACTS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
        { number: '0', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page', color: '#CF3232' },
        { number: '0', label: 'LINK CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' }
      ];
    }

    return [
      { 
        number: statistics.total_bookings?.toString() || '0', 
        label: 'BOOKINGS', 
        description: 'New Meetings, Consultations, Or Events Scheduled', 
        color: '#CF3232' 
      },
      { 
        number: statistics.total_contacts?.toString() || '0', 
        label: 'CONTACTS', 
        description: 'People Who Joined Your Mailing List', 
        color: '#CF3232' 
      },
      { 
        number: statistics.total_visits || '0', 
        label: 'PAGE VIEWS', 
        description: 'Total Number Of Times Your Signature Page Was Viewed', 
        color: '#CF3232' 
      },
      { 
        number: statistics.total_link_clicks || '0', 
        label: 'LINK CLICKS', 
        description: 'Combined Total Of Clicks Across All Links', 
        color: '#CF3232' 
      }
    ];
  }, [statistics]);

  const demographicsData = useMemo(() => {
    if (!statistics || !statistics.audience_demographics || statistics.audience_demographics.length === 0) {
      return [
        { country: 'No Data', device: 'No Data', age: 'No Data', role: 'No Data', percentage: '0%' }
      ];
    }

    return statistics.audience_demographics.map(demo => ({
      country: demo.countries || 'Unknown',
      device: demo.devices || 'Unknown',
      age: demo.age_groups || 'Unknown',
      role: demo.top_roles || 'Unknown',
      percentage: `${demo.percentage || 0}%`
    }));
  }, [statistics]);

  // Memoize callback functions
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleStartTour = useCallback(() => {
    setShowTour(true);
  }, []);

  const handleWelcomeModalClose = useCallback(() => {
    setShowWelcomeModal(false);
    localStorage.setItem('welcome_modal_shown', 'true');
    
    // Show profile card if profile is incomplete and tour not started
    if (profileCompletion && profileCompletion.percentage < 100 && !showTour) {
      setTimeout(() => {
        setShowProfileCard(true);
      }, 500);
    }
  }, [profileCompletion, showTour]);

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    // Show profile completion card after tour if profile is incomplete
    if (profileCompletion && profileCompletion.percentage < 100) {
      setTimeout(() => {
        setShowProfileCard(true);
      }, 500);
    }
  }, [profileCompletion]);

  const handleProfileCardClose = useCallback(() => {
    setShowProfileCard(false);
    localStorage.setItem('profile_card_dismissed', 'true');
  }, []);

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFF9F9]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#CF3232] mb-4 mx-auto" />
          <p className="text-gray-600 font-outfit">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal 
          onStartTour={handleStartTour}
          onClose={handleWelcomeModalClose}
        />
      )}

      {/* Tour Guide */}
      {showTour && <DashboardTour onComplete={handleTourComplete} />}
      
      {/* Profile Completion Card */}
      {showProfileCard && profileCompletion && (
        <ProfileCompletionCard
          incompleteFields={profileCompletion.incomplete_fields}
          completionPercentage={profileCompletion.percentage}
          onClose={handleProfileCardClose}
        />
      )}

      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="dashboard"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
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
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    0
                  </span> */}
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    0
                  </span> */}
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
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

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#CF3232] mb-4 mx-auto" />
                  <p className="text-gray-600">Loading dashboard statistics...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-red-400 hover:text-red-600 text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {/* Main Content */}
            {!loading && !error && (
              <div className="space-y-6 lg:space-y-8">
                
                {/* Stats Cards */}
                <div>
                  <StatsCards stats={statsCards} columns={4} />
                </div>

                {/* Additional Statistics */}
                {statistics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Today&apos;s Visits</h3>
                      <p className="text-2xl font-bold text-[#CF3232]">{statistics.today_visits || '0'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Unique Visitors</h3>
                      <p className="text-2xl font-bold text-[#CF3232]">{statistics.unique_visitors || '0'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">This Week</h3>
                      <p className="text-2xl font-bold text-[#CF3232]">{statistics.this_week_visits?.length || '0'}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">This Month</h3>
                      <p className="text-2xl font-bold text-[#CF3232]">{statistics.this_month_visits?.length || '0'}</p>
                    </div>
                  </div>
                )}

                {/* Audience Demographics */}
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">
                      Audience Demographics
                    </h2>
                    {statistics && (
                      <span className="text-sm text-gray-500">
                        Based on {statistics.total_visits} total visits
                      </span>
                    )}
                  </div>
                  
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
                      Showing {demographicsData.length} demographic entries
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <span className="px-3 py-1 bg-[#CF3232] text-white rounded text-sm">1</span>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default Dashboard;