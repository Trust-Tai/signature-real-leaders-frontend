"use client";

import React, { useState, useMemo } from 'react';
import { Search, Menu, Rss, Calendar, FileText, ExternalLink } from 'lucide-react';
import { UserProfileSidebar, useUser } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

const FollowingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Extract RSS feed data from user
  const rssFeedData = useMemo(() => {
    if (!user?.rss_feeds) return null;
    
    return {
      feed_url: user.rss_feeds.feed_url || '',
      feed_title: user.rss_feeds.feed_title || 'RSS Feed',
      feed_description: user.rss_feeds.feed_description || '',
      items: user.rss_feeds.items || [],
      total_items: user.rss_feeds.total_items || 0,
      fetched_at: user.rss_feeds.fetched_at || ''
    };
  }, [user?.rss_feeds]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!rssFeedData?.items) return [];
    
    if (!searchQuery.trim()) return rssFeedData.items;
    
    const query = searchQuery.toLowerCase();
    return rssFeedData.items.filter(item =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    );
  }, [rssFeedData?.items, searchQuery]);

  // Calculate stats from RSS feed
  const stats = useMemo(() => {
    const totalContent = rssFeedData?.items?.length || 0;
    const totalItems = rssFeedData?.total_items || 0;
    
    // Get latest content date
    let latestDate = '';
    if (rssFeedData?.items && rssFeedData.items.length > 0) {
      rssFeedData.items.forEach(item => {
        if (item.pub_date && (!latestDate || new Date(item.pub_date) > new Date(latestDate))) {
          latestDate = item.pub_date;
        }
      });
    }

    return {
      totalFeeds: rssFeedData ? 1 : 0,
      totalContent,
      totalItems,
      latestUpdate: latestDate ? new Date(latestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      fetchedAt: rssFeedData?.fetched_at ? new Date(rssFeedData.fetched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
    };
  }, [rssFeedData]);

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="following"
      />

      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        {/* Header */}
        <header className="bg-white px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSidebarToggle}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 className="text-[#101117] text-lg sm:text-xl lg:text-2xl font-bold">
                Following
              </h1>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search accounts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit focus:outline-none focus:ring-2 focus:ring-[#CF3232]/20 focus:border-[#CF3232]/30 transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-3">
              
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Stats Cards - Dashboard Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* RSS Feed */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Rss className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.totalFeeds}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    RSS FEED
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {rssFeedData?.feed_title || 'No RSS Feed Connected'}
                </p>
              </div>

              {/* Showing Items */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.totalContent}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    SHOWING ITEMS
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Content Items Currently Displayed
                </p>
              </div>

              {/* Total Items */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.totalItems}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    TOTAL ITEMS
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Total Items Available in Feed
                </p>
              </div>

              {/* Latest Update */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.latestUpdate}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    LATEST UPDATE
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Most Recent Content Published
                </p>
              </div>
            </div>

            {/* Empty State */}
            {!rssFeedData && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Rss className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No RSS Feed Connected</h3>
                <p className="text-gray-500 mb-4">
                  Connect your RSS feed in profile settings to see content here
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard/profile'}
                  className="px-6 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Go to Profile Settings
                </button>
              </div>
            )}

            {/* No Results State */}
            {rssFeedData && filteredItems.length === 0 && searchQuery && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                <p className="text-gray-500">
                  Try a different search term
                </p>
              </div>
            )}

            {/* RSS Feed Content */}
            {rssFeedData && filteredItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Rss className="w-6 h-6 text-[#CF3232]" />
                        <h2 className="text-2xl font-bold text-[#101117]">{rssFeedData.feed_title}</h2>
                      </div>
                      {rssFeedData.feed_description && (
                        <p className="text-sm text-gray-500 mt-2">
                          {rssFeedData.feed_description}
                        </p>
                      )}
                    </div>
                    {rssFeedData.feed_url && (
                      <a
                        href={rssFeedData.feed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#CF3232] hover:text-[#a82828] font-medium flex items-center"
                      >
                        View Feed
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  {stats.fetchedAt !== 'N/A' && (
                    <p className="text-xs text-gray-400 mt-2">
                      Last fetched: {stats.fetchedAt}
                    </p>
                  )}
                </div>

                {/* Feed Items */}
                <div className="divide-y divide-gray-100">
                  {filteredItems.map((item, index) => (
                    <div key={index} className="p-6 hover:bg-[#FFF9F9] transition-colors">
                      {/* Header with Date and Category */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {item.pub_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(item.pub_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          )}
                          {item.category && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-[#CF3232] font-medium">
                                {item.category}
                              </span>
                            </>
                          )}
                        </div>
                        {item.author && (
                          <span className="text-xs text-gray-500">
                            By {item.author}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#101117] mb-2 hover:text-[#CF3232] transition-colors">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        </h4>
                        {(item.description || item.content) && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {item.content || item.description}
                          </p>
                        )}
                        <a 
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-[#CF3232] hover:text-[#a82828] font-medium transition-colors"
                        >
                          Read full article
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default FollowingPage;
