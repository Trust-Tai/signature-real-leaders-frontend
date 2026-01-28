"use client";

import React, { useState, useMemo } from 'react';
import { Search, Menu, Rss, Calendar, FileText, ExternalLink } from 'lucide-react';
import { UserProfileSidebar, useUser } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

// Utility function to detect if text contains HTML tags
const containsHTML = (text: string): boolean => {
  const htmlRegex = /<[^>]*>/;
  return htmlRegex.test(text);
};

// Utility function to strip HTML tags and get plain text
const stripHTML = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Component to render content based on whether it contains HTML
const ContentRenderer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;
  
  const hasHTML = containsHTML(content);
  
  if (hasHTML) {
    // If content has HTML, render it safely with dangerouslySetInnerHTML
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  } else {
    // If no HTML, render as plain text
    return (
      <p className={className}>
        {content}
      </p>
    );
  }
};

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
    return rssFeedData.items.filter(item => {
      // Search in title
      const titleMatch = item.title?.toLowerCase().includes(query);
      
      // Search in description (strip HTML for search)
      const descriptionText = item.description ? 
        (containsHTML(item.description) ? stripHTML(item.description) : item.description) : '';
      const descriptionMatch = descriptionText.toLowerCase().includes(query);
      
      // Search in content (strip HTML for search)
      const contentText = item.content ? 
        (containsHTML(item.content) ? stripHTML(item.content) : item.content) : '';
      const contentMatch = contentText.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || contentMatch;
    });
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
        currentPage="rss-feed"
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
              RSS FEED
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
                        <ContentRenderer 
                          content={rssFeedData.feed_description}
                          className="text-sm text-gray-500 mt-2"
                        />
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

                {/* Feed Items - Grid Layout */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                      <div 
                        key={index} 
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#CF3232]/30 transition-all duration-200 flex flex-col"
                      >
                        {/* Header with Date and Category */}
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
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
                          </div>
                          {item.category && (
                            <span className="text-xs text-white bg-[#CF3232] px-2 py-1 rounded-full font-medium">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                          <h4 className="text-lg font-semibold text-[#101117] mb-2 hover:text-[#CF3232] transition-colors line-clamp-2">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h4>
                          {(item.description || item.content) && (
                            <div className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 rss-content">
                              <ContentRenderer 
                                content={item.content || item.description}
                                className="text-sm text-gray-600"
                              />
                            </div>
                          )}
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            {item.author && (
                              <span className="text-xs text-gray-500">
                                By {item.author}
                              </span>
                            )}
                            <a 
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-[#CF3232] hover:text-[#a82828] font-medium transition-colors ml-auto"
                            >
                              Read more
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <DashBoardFooter />
      </div>
      
      {/* CSS for RSS content styling */}
      <style jsx global>{`
        .rss-content {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        .rss-content p {
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .rss-content p:last-child {
          margin-bottom: 0;
        }
        
        .rss-content strong {
          font-weight: 600;
          color: #374151;
        }
        
        .rss-content em {
          font-style: italic;
        }
        
        .rss-content a {
          color: #CF3232;
          text-decoration: underline;
        }
        
        .rss-content a:hover {
          color: #a82828;
        }
        
        .rss-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
          color: #374151;
        }
        
        .rss-content pre {
          background-color: #f3f4f6;
          padding: 0.5rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        
        .rss-content ul, .rss-content ol {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
        }
        
        .rss-content li {
          margin: 0.25rem 0;
        }
        
        .rss-content blockquote {
          border-left: 4px solid #CF3232;
          padding-left: 1rem;
          margin: 0.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .rss-content h1, .rss-content h2, .rss-content h3, 
        .rss-content h4, .rss-content h5, .rss-content h6 {
          font-weight: 600;
          color: #374151;
          margin: 0.5rem 0 0.25rem 0;
        }
        
        .rss-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        
        /* Ensure content doesn't overflow the card */
        .rss-content * {
          max-width: 100%;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default FollowingPage;
