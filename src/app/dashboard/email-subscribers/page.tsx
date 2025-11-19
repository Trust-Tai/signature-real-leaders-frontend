"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Bell, User, ChevronLeft, ChevronRight, Menu, X, Plus, Download, Filter, Link as LinkIcon, Loader2, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { 
  getNewsletterStats, 
  getNewsletterSubscribers, 
  getDateRange,
  addNewsletterSubscriber,
  type NewsletterStats,
  type SubscriberFilters 
} from '@/lib/newsletterApi';
import { toast } from '@/components/ui/toast';

interface LocalSubscriber {
  id: number;
  email: string;
  name: string;
  status: string;
  date: string;
  list_name?: string;
}

const EmailSubscribers = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [addSubscriberModalOpen, setAddSubscriberModalOpen] = useState(false);
  const [editSubscriberModalOpen, setEditSubscriberModalOpen] = useState(false);
  const [espModalOpen, setEspModalOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<LocalSubscriber | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: '',
    dateFrom: '',
    dateTo: ''
  });
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    status: 'Active'
  });
  const [espConnection, setEspConnection] = useState({
    provider: '',
    apiKey: '',
    listId: '',
    connected: false
  });

  // API State
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribersData, setSubscribersData] = useState<LocalSubscriber[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch newsletter stats
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getNewsletterStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err instanceof Error && err.message === 'NO_NEWSLETTER_SERVICE') {
        setError('NO_NEWSLETTER_SERVICE');
      } else {
        setError('Failed to load newsletter statistics');
      }
    }
  }, []);

  // Fetch subscribers with filters
  const fetchSubscribers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const apiFilters: SubscriberFilters = {
        page,
        per_page: 20
      };

      // Apply filters
      if (filters.status !== 'all') {
        apiFilters.status = filters.status as 'active' | 'unsubscribed';
      }
      if (filters.searchTerm) {
        apiFilters.search = filters.searchTerm;
      }

      // Handle date range
      if (filters.dateRange !== 'all') {
        const dateRange = getDateRange(filters.dateRange);
        if (dateRange.date_from) apiFilters.date_from = dateRange.date_from;
        if (dateRange.date_to) apiFilters.date_to = dateRange.date_to;
      }

      // Handle custom date range
      if (filters.dateFrom) apiFilters.date_from = filters.dateFrom;
      if (filters.dateTo) apiFilters.date_to = filters.dateTo;

      const subscribersResponse = await getNewsletterSubscribers(apiFilters);
      
      if (subscribersResponse.success) {
        // Convert API subscribers to local format
        // API returns subscribers as a direct array
        const allSubscribers = subscribersResponse.data.subscribers || [];
        
        const localSubscribers: LocalSubscriber[] = allSubscribers.map((sub, index) => ({
          id: (page - 1) * 20 + index + 1,
          name: sub.name,
          email: sub.email,
          status: sub.status,
          date: sub.date_joined.split(' ')[0], // Extract date part
          list_name: sub.list_name
        }));

        setSubscribersData(localSubscribers);
        setPagination(subscribersResponse.data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      if (err instanceof Error && err.message === 'NO_NEWSLETTER_SERVICE') {
        setError('NO_NEWSLETTER_SERVICE');
      } else {
        setError('Failed to load subscribers');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchSubscribers();
  }, [fetchStats, fetchSubscribers]);

  // Refetch when filters change
  useEffect(() => {
    fetchSubscribers(1);
  }, [filters, fetchSubscribers]);

  // Generate stats cards from API data
  const statsCards = stats ? [
    { 
      number: stats.data.total_subscribers.toLocaleString(), 
      label: 'TOTAL SUBSCRIBERS', 
      description: 'People who joined your mailing list', 
      color: '#CF3232' 
    },
    { 
      number: stats.data.active_subscribers.toLocaleString(), 
      label: 'ACTIVE SUBSCRIBERS', 
      description: 'Currently receiving your emails', 
      color: '#CF3232' 
    },
    { 
      number: stats.data.unsubscribed_users.toLocaleString(), 
      label: 'UNSUBSCRIBED', 
      description: 'People who opted out', 
      color: '#CF3232' 
    },
    { 
      number: `${stats.data.monthly_growth_rate}%`, 
      label: 'GROWTH RATE', 
      description: 'Monthly subscriber increase', 
      color: '#CF3232' 
    }
  ] : [
    { number: '0', label: 'TOTAL SUBSCRIBERS', description: 'People who joined your mailing list', color: '#CF3232' },
    { number: '0', label: 'ACTIVE SUBSCRIBERS', description: 'Currently receiving your emails', color: '#CF3232' },
    { number: '0', label: 'UNSUBSCRIBED', description: 'People who opted out', color: '#CF3232' },
    { number: '0%', label: 'GROWTH RATE', description: 'Monthly subscriber increase', color: '#CF3232' }
  ];

  const [addingSubscriber, setAddingSubscriber] = useState(false);

  const handleAddSubscriber = async () => {
    if (newSubscriber.name && newSubscriber.email) {
      try {
        setAddingSubscriber(true);
        
        // Split name into first and last name
        const nameParts = newSubscriber.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const payload = {
          email: newSubscriber.email,
          first_name: firstName,
          last_name: lastName
        };
        
        const response = await addNewsletterSubscriber(payload);
        
        if (response.success) {
          toast.success(response.message || 'Subscriber added successfully!');
          
          // Refresh both stats and subscribers list
          await Promise.all([
            fetchStats(),
            fetchSubscribers(currentPage)
          ]);
          
          setNewSubscriber({ name: '', email: '', status: 'Active' });
          setAddSubscriberModalOpen(false);
        }
      } catch (error) {
        console.error('Error adding subscriber:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to add subscriber';
        toast.error(errorMessage);
      } finally {
        setAddingSubscriber(false);
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleEditSubscriber = (subscriber: LocalSubscriber) => {
    setEditingSubscriber(subscriber);
    setEditSubscriberModalOpen(true);
  };

  const handleUpdateSubscriber = () => {
    if (editingSubscriber) {
      // In a real implementation, you would call an API to update the subscriber
      // For now, we'll just refresh the data
      fetchSubscribers(currentPage);
      setEditSubscriberModalOpen(false);
      setEditingSubscriber(null);
    }
  };

  const handlePageChange = (page: number) => {
    fetchSubscribers(page);
  };

  const handleApplyFilters = () => {
    setFilterModalOpen(false);
    fetchSubscribers(1);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      searchTerm: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleExportSubscribers = () => {
    if (subscribersData.length === 0) {
      alert('No subscribers to export');
      return;
    }

    const exportData = subscribersData.map(sub => ({
      Name: sub.name,
      Email: sub.email,
      Status: sub.status,
      'Date Joined': sub.date,
      'List Name': sub.list_name || ''
    }));
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEspConnection = () => {
    if (espConnection.provider && espConnection.apiKey && espConnection.listId) {
      setEspConnection({...espConnection, connected: true});
      setEspModalOpen(false);
      // Here you would typically make an API call to connect to the ESP
      console.log('Connecting to ESP:', espConnection);
    }
  };

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="email-subscribers"
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
                Newsletter Subscribers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search newsletter subscribers..." 
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
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
          
          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
              style={{ color: '#949494' }}
            />
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Stats Cards */}
            {error !== 'NO_NEWSLETTER_SERVICE' && (
              <StatsCards stats={statsCards} columns={4} />
            )}

            {/* Action Buttons */}
            {error !== 'NO_NEWSLETTER_SERVICE' && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => setAddSubscriberModalOpen(true)}
                className="bg-[#CF3232] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Newsletter Subscriber</span>
              </button>
              <button 
                onClick={() => setEspModalOpen(true)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  espConnection.connected 
                    ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200' 
                    : 'bg-white text-[#CF3232] border border-[#CF3232] hover:bg-red-50'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>{espConnection.connected ? 'ESP Connected' : 'Link ESP'}</span>
              </button>
              <button 
                onClick={handleExportSubscribers}
                className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export List</span>
              </button>
              <button 
                onClick={() => setFilterModalOpen(true)}
                className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                {error === 'NO_NEWSLETTER_SERVICE' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="text-red-800 text-sm font-medium">
                          Newsletter Service Not Configured
                        </div>
                        <div className="text-red-600 text-sm">
                          Please add your newsletter service to view subscriber data
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/dashboard/profile?step=5')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Setup Newsletter Service
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="text-red-800 text-sm font-medium">
                      {error}
                    </div>
                    <button
                      onClick={() => {
                        setError(null);
                        fetchStats();
                        fetchSubscribers(currentPage);
                      }}
                      className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters Display */}
            {(filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm || filters.dateFrom || filters.dateTo) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-800">Active Filters:</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {filters.status}
                      <button
                        onClick={() => setFilters({...filters, status: 'all'})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {filters.dateRange !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Date: {filters.dateRange}
                      <button
                        onClick={() => setFilters({...filters, dateRange: 'all'})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  
                  {filters.searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: &quot;{filters.searchTerm}&quot;
                      <button
                        onClick={() => setFilters({...filters, searchTerm: ''})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {(filters.dateFrom || filters.dateTo) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Custom Date: {filters.dateFrom} - {filters.dateTo}
                      <button
                        onClick={() => setFilters({...filters, dateFrom: '', dateTo: ''})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Subscribers Table */}
            {error !== 'NO_NEWSLETTER_SERVICE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">
                    Newsletter Subscriber List
                  </h2>
                  {stats && (
                    <div className="text-sm text-gray-500">
                      Platform: {stats.data.marketing_platform} | {stats.data.account_name}
                    </div>
                  )}
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#CF3232]" />
                  <span className="ml-2 text-gray-600">Loading subscribers...</span>
                </div>
              ) : subscribersData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No subscribers found</div>
                  <div className="text-gray-400 text-sm">Try adjusting your filters or add new subscribers</div>
                </div>
              ) : (
                <>
                  {/* Mobile View - Cards */}
                  <div className="block sm:hidden p-4 space-y-4">
                    {subscribersData.map((subscriber) => (
                      <div key={subscriber.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#101117]">{subscriber.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            subscriber.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{subscriber.email}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Joined: {subscriber.date}</span>
                          {subscriber.list_name && <span>List: {subscriber.list_name}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Date Joined</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">List</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribersData.map((subscriber) => (
                          <tr key={subscriber.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.name}</td>
                            <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.email}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                subscriber.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {subscriber.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.date}</td>
                            <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.list_name || '-'}</td>
                            <td className="py-4 px-4">
                              <button 
                                onClick={() => handleEditSubscriber(subscriber)}
                                className="text-[#CF3232] hover:text-red-600 text-sm font-medium"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Pagination */}
              {!loading && subscribersData.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 text-center sm:text-left">
                      Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total.toLocaleString()} newsletter subscribers
                    </p>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.total_pages - 4, pagination.page - 2)) + i;
                        if (pageNum > pagination.total_pages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded text-sm ${
                              pageNum === pagination.page
                                ? 'bg-[#CF3232] text-white'
                                : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button 
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.total_pages}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          
          {/* Filter Modal */}
          {filterModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setFilterModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Filter Newsletter Subscribers
                    </h2>
                    <button
                      onClick={() => setFilterModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Subscription Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="all" className="text-[#101117]">All Statuses</option>
                      <option value="active" className="text-[#101117]">Active</option>
                      <option value="unsubscribed" className="text-[#101117]">Unsubscribed</option>
                      <option value="pending" className="text-[#101117]">Pending</option>
                    </select>
                  </div>

                  

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => {
                        setFilters({...filters, dateRange: e.target.value, dateFrom: '', dateTo: ''});
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="all" className="text-[#101117]">All Time</option>
                      <option value="today" className="text-[#101117]">Today</option>
                      <option value="week" className="text-[#101117]">This Week</option>
                      <option value="month" className="text-[#101117]">This Month</option>
                      <option value="quarter" className="text-[#101117]">This Quarter</option>
                      <option value="year" className="text-[#101117]">This Year</option>
                      <option value="custom" className="text-[#101117]">Custom Range</option>
                    </select>
                  </div>

                  {/* Custom Date Range */}
                  {filters.dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#101117] mb-3">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#101117] mb-3">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Search Term */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Search Term
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent font-outfit"
                      style={{ color: '#949494' }}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Subscriber Modal */}
          {addSubscriberModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setAddSubscriberModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Add New Newsletter Subscriber
                    </h2>
                    <button
                      onClick={() => setAddSubscriberModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name..."
                      value={newSubscriber.name}
                      onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      value={newSubscriber.email}
                      onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Status
                    </label>
                    <select
                      value={newSubscriber.status}
                      onChange={(e) => setNewSubscriber({...newSubscriber, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setAddSubscriberModalOpen(false)}
                    disabled={addingSubscriber}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubscriber}
                    disabled={addingSubscriber}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {addingSubscriber ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Newsletter Subscriber</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Subscriber Modal */}
          {editSubscriberModalOpen && editingSubscriber && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setEditSubscriberModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Edit Newsletter Subscriber
                    </h2>
                    <button
                      onClick={() => setEditSubscriberModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name..."
                      value={editingSubscriber.name}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      value={editingSubscriber.email}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Status
                    </label>
                    <select
                      value={editingSubscriber.status}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setEditSubscriberModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSubscriber}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Update Newsletter Subscriber
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ESP Connection Modal */}
          {espModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setEspModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Link Email Service Provider
                    </h2>
                    <button
                      onClick={() => setEspModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* ESP Provider */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Email Service Provider
                    </label>
                    <select
                      value={espConnection.provider}
                      onChange={(e) => setEspConnection({...espConnection, provider: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="" className="text-[#101117]">Select ESP Provider</option>
                      <option value="mailchimp" className="text-[#101117]">Mailchimp</option>
                      <option value="constant-contact" className="text-[#101117]">Constant Contact</option>
                      <option value="aweber" className="text-[#101117]">AWeber</option>
                      <option value="convertkit" className="text-[#101117]">ConvertKit</option>
                      <option value="activecampaign" className="text-[#101117]">ActiveCampaign</option>
                      <option value="sendinblue" className="text-[#101117]">Sendinblue</option>
                    </select>
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your API key..."
                      value={espConnection.apiKey}
                      onChange={(e) => setEspConnection({...espConnection, apiKey: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* List ID */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      List ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your list ID..."
                      value={espConnection.listId}
                      onChange={(e) => setEspConnection({...espConnection, listId: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Connection Status */}
                  {espConnection.connected && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-800 text-sm font-medium">
                          Successfully connected to {espConnection.provider}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setEspModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEspConnection}
                    disabled={!espConnection.provider || !espConnection.apiKey || !espConnection.listId}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {espConnection.connected ? 'Update Connection' : 'Connect ESP'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Fixed Footer */}
         <DashBoardFooter />
      </div>
    </div>
  );
};

export default EmailSubscribers;
