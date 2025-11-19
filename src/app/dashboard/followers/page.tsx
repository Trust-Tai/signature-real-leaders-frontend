"use client";

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Search, Bell, User as UserIcon, Menu, X, Download, Filter } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';
import { api } from '@/lib/api';
import DashBoardFooter from '@/components/ui/dashboardFooter';

type Follower = {
  id: number;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  date_of_birth: string;
  occupation: string;
  company_name: string;
  date_followed: string;
  follow_id: number;
  // Computed fields for compatibility
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  followedAt: string;
  location: string;
  joined: string;
};

const FollowersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [followersData, setFollowersData] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<{
    success: boolean;
    stats: {
      total_followers: number;
      current_month_followers: number;
      top_country: { name: string | null; count: number; percentage: number };
      top_location: { name: string | null; count: number; percentage: number };
      all_countries: Array<{ name: string; count: number; percentage: number }>;
      all_locations: Array<{ name: string; count: number; percentage: number }>;
    };
    period: {
      current_month: string;
      month_start: string;
      generated_at: string;
    };
  } | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Transform API data to match our component structure
  const transformFollowerData = useCallback((apiFollower: {
    id: number;
    first_name: string;
    last_name: string;
    display_name: string;
    email: string;
    date_of_birth: string;
    occupation: string;
    company_name: string;
    date_followed: string;
    follow_id: number;
  }): Follower => {
    const firstName = apiFollower.first_name || '';
    const lastName = apiFollower.last_name || '';
    const name = `${firstName} ${lastName}`.trim();
    const age = calculateAge(apiFollower.date_of_birth);
    const followedAt = formatDate(apiFollower.date_followed);
    
    return {
      ...apiFollower,
      name,
      firstName,
      lastName,
      age,
      followedAt,
      location: apiFollower.company_name || 'Unknown', // Using company_name as location for now
      joined: followedAt, // Using date_followed as joined date
    };
  }, []);

  // Fetch followers from API
  const fetchFollowers = useCallback(async (page: number = 1) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.getFollowers(token, page, 20);
      if (response && response.success) {
        const transformedFollowers = response.followers.map(transformFollowerData);
        setFollowersData(transformedFollowers);
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.total_pages);
        setTotalFollowers(response.pagination.total_followers);
      } else {
        setError('Failed to fetch followers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch followers');
    } finally {
      setLoading(false);
    }
  }, [transformFollowerData]);

  // Fetch stats from API
  const fetchStats = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    try {
      const response = await api.getFollowerStats(token);
      if (response && response.success) {
        setStatsData(response);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Search followers using API
  const searchFollowers = async (query: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    if (!query.trim()) {
      setIsSearchMode(false);
      fetchFollowers();
      return;
    }

    setSearchLoading(true);
    setIsSearchMode(true);

    try {
      const response = await api.searchFollowers(token, query.trim());
      if (response && response.success) {
        const transformedFollowers = response.followers.map(transformFollowerData);
        setFollowersData(transformedFollowers);
        setCurrentPage(response.pagination.current_page);
        setTotalPages(response.pagination.total_pages);
        setTotalFollowers(response.search.total_matches);
      } else {
        setError('Failed to search followers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search followers');
    } finally {
      setSearchLoading(false);
    }
  };

  // Remove automatic search - now only triggered by Apply button

  useEffect(() => {
    fetchFollowers();
    fetchStats();
  }, [fetchFollowers]);

  const filtered = useMemo(() => {
    // If we're in search mode, return the data as-is since API already filtered it
    if (isSearchMode) {
      return followersData;
    }
    
    // Otherwise, apply local filtering for non-search mode
    const term = searchTerm.trim().toLowerCase();
    if (!term) return followersData;
    return followersData.filter((f) =>
      f.name.toLowerCase().includes(term) ||
      f.firstName.toLowerCase().includes(term) ||
      f.lastName.toLowerCase().includes(term) ||
      f.display_name.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term) ||
      f.location.toLowerCase().includes(term) ||
      f.occupation.toLowerCase().includes(term) ||
      f.company_name.toLowerCase().includes(term)
    );
  }, [followersData, searchTerm, isSearchMode]);

  const statsCards = useMemo(() => {
    if (!statsData || !statsData.stats) {
      return [
        { number: '...', label: 'MEMBERS', description: 'All people following you', color: '#CF3232' },
        { number: '...', label: 'NEW THIS MONTH', description: 'Members added this month', color: '#CF3232' },
        { number: '...', label: 'TOP COUNTRY', description: 'Most common member country', color: '#CF3232', smallText: true },
        { number: '...', label: 'TOP LOCATION', description: 'Most common member location', color: '#CF3232', smallText: true },
      ];
    }

    const { stats } = statsData;
    const total = stats.total_followers?.toString() || '0';
    const newThisMonth = stats.current_month_followers?.toString() || '0';
    const topCountry = stats.top_country?.name || 'N/A';
    const topLocation = stats.top_location?.name || 'N/A';

    return [
      { number: total, label: 'MEMBERS', description: 'All people following you', color: '#CF3232' },
      { number: newThisMonth, label: 'NEW THIS MONTH', description: 'Members added this month', color: '#CF3232' },
      { number: topCountry, label: 'TOP COUNTRY', description: 'Most common member country', color: '#CF3232', smallText: true },
      { number: topLocation, label: 'TOP LOCATION', description: 'Most common member location', color: '#CF3232', smallText: true },
    ];
  }, [statsData]);

  const handleExportFollowers = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    setExportLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log('Starting CSV export...');
      
      // API now returns raw CSV data directly
      const csvData = await api.exportFollowersCSV(token);
      console.log('CSV data received:', csvData ? 'Data received' : 'No data');
      
      // Basic validation
      if (!csvData || typeof csvData !== 'string' || csvData.trim().length === 0) {
        setError('No CSV data received from server');
        return;
      }

      // Create and download the CSV file directly
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `followers-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Followers exported successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export followers';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentPage="followers"
      />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Members
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search members..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">3</span> */}
                </div>
                <div className="relative">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">16</span> */}
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
              style={{ color: '#949494' }}
            />
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CF3232] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading members...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-red-500 text-lg mb-4">⚠️</div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button 
                    onClick={() => fetchFollowers()}
                    className="bg-[#CF3232] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                <StatsCards stats={statsCards} columns={4} />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleExportFollowers}
                disabled={exportLoading}
                className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{exportLoading ? 'Exporting...' : 'Export Members'}</span>
              </button>
              <button 
                onClick={() => {
                  setFilterSearchTerm(searchTerm);
                  setFilterOpen(true);
                }}
                className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">Member List</h2>
                  {searchLoading && (
                    <div className="flex items-center space-x-2 text-[#CF3232]">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#CF3232]"></div>
                      <span className="text-sm">Filtering...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className={`block sm:hidden p-4 space-y-4 relative ${searchLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                {searchLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="flex items-center space-x-2 text-[#CF3232]">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CF3232]"></div>
                      <span className="text-sm font-medium">Filtering members...</span>
                    </div>
                  </div>
                )}
                {filtered.map((f) => (
                  <div key={f.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#101117]">{f.display_name || `${f.first_name} ${f.last_name}`}</h3>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Follower
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Email: {f.email}</p>
                    {f.occupation && <p className="text-gray-600 text-sm">Occupation: {f.occupation}</p>}
                    {f.company_name && <p className="text-gray-600 text-sm">Company: {f.company_name}</p>}
                    {f.age > 0 && <p className="text-gray-600 text-sm">Age: {f.age}</p>}
                    <div className="text-xs text-gray-500 mt-2">Followed On: {f.followedAt}</div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className={`hidden sm:block overflow-x-auto relative ${searchLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                {searchLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="flex items-center space-x-2 text-[#CF3232]">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CF3232]"></div>
                      <span className="text-sm font-medium">Filtering members...</span>
                    </div>
                  </div>
                )}
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Occupation</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Age</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Followed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.display_name || `${f.first_name} ${f.last_name}`}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.email}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.company_name || '-'}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.occupation || '-'}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.age > 0 ? f.age : '-'}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.followedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {filtered.length} of {totalFollowers} members
                  </p>
                  
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (isSearchMode) {
                            searchFollowers(searchTerm);
                          } else {
                            fetchFollowers(currentPage - 1);
                          }
                        }}
                        disabled={currentPage === 1 || loading || searchLoading}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => {
                          if (isSearchMode) {
                            searchFollowers(searchTerm);
                          } else {
                            fetchFollowers(currentPage + 1);
                          }
                        }}
                        disabled={currentPage === totalPages || loading || searchLoading}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Filter Modal */}
          {filterOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setFilterOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>Filter Members</h2>
                    <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">Search Term</label>
                    <input
                      type="text"
                      placeholder="Search by name, email, company, or occupation..."
                      value={filterSearchTerm}
                      onChange={(e) => setFilterSearchTerm(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent font-outfit"
                      style={{ color: '#949494' }}
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => {
                      setFilterSearchTerm('');
                      setSearchTerm('');
                      setIsSearchMode(false);
                      fetchFollowers();
                      setFilterOpen(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm(filterSearchTerm);
                      if (filterSearchTerm.trim()) {
                        searchFollowers(filterSearchTerm);
                      } else {
                        setIsSearchMode(false);
                        fetchFollowers();
                      }
                      setFilterOpen(false);
                    }}
                    disabled={searchLoading}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? 'Searching...' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          )}

           <DashBoardFooter />
        </main>
      </div>
    </div>
  );
};

export default FollowersPage;


