"use client";

import React, { useState, useMemo } from 'react';
import { Search, Bell, Menu, Users, Rss, Calendar, FileText, ExternalLink } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import Image from 'next/image';

// Mock data for followed accounts (will be replaced with API data later)
const followedAccounts = [
  {
    id: 1,
    username: 'johndoe',
    full_name: 'John Doe',
    profile_picture: '/placeholder-avatar.jpg',
    bio: 'Tech entrepreneur and podcast host',
    rss_feeds: [
      {
        id: 1,
        title: 'Tech Talks Podcast',
        url: 'https://example.com/rss/tech-talks',
        latest_items: [
          {
            title: 'The Future of AI in Business',
            link: 'https://example.com/episode-1',
            pubDate: '2024-01-15',
            description: 'Exploring how AI is transforming modern business practices...'
          },
          {
            title: 'Building Scalable Startups',
            link: 'https://example.com/episode-2',
            pubDate: '2024-01-10',
            description: 'Key strategies for scaling your startup effectively...'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    username: 'janesmit',
    full_name: 'Jane Smith',
    profile_picture: '/placeholder-avatar.jpg',
    bio: 'Marketing expert and content creator',
    rss_feeds: [
      {
        id: 2,
        title: 'Marketing Insights Blog',
        url: 'https://example.com/rss/marketing',
        latest_items: [
          {
            title: '10 Social Media Trends for 2024',
            link: 'https://example.com/post-1',
            pubDate: '2024-01-12',
            description: 'Stay ahead with these emerging social media trends...'
          }
        ]
      }
    ]
  }
];

const FollowingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredAccounts = followedAccounts.filter(account =>
    account.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats from followed accounts
  const stats = useMemo(() => {
    const totalFollowing = followedAccounts.length;
    const totalRSSFeeds = followedAccounts.reduce((sum, account) => sum + account.rss_feeds.length, 0);
    const totalContent = followedAccounts.reduce((sum, account) => {
      return sum + account.rss_feeds.reduce((feedSum, feed) => feedSum + feed.latest_items.length, 0);
    }, 0);
    
    // Get latest content date
    let latestDate = '';
    followedAccounts.forEach(account => {
      account.rss_feeds.forEach(feed => {
        feed.latest_items.forEach(item => {
          if (!latestDate || new Date(item.pubDate) > new Date(latestDate)) {
            latestDate = item.pubDate;
          }
        });
      });
    });

    return {
      totalFollowing,
      totalRSSFeeds,
      totalContent,
      latestUpdate: latestDate ? new Date(latestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'
    };
  }, []);

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
            
            {/* Stats Cards - Dashboard Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Following */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.totalFollowing}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    FOLLOWING
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Total Accounts You Are Following
                </p>
              </div>

              {/* RSS Feeds */}
              <div className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-end mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Rss className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                    {stats.totalRSSFeeds}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm tracking-wide text-[#CF3232]">
                    RSS FEEDS
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Active RSS Feeds From Followed Accounts
                </p>
              </div>

              {/* Total Content */}
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
                    CONTENT ITEMS
                  </p>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Total Content Pieces Available
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
                  <h3 className="text-lg sm:text-xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
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
            {filteredAccounts.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Accounts Found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'Start following accounts to see their content here'}
                </p>
              </div>
            )}

            {/* Combined Feed View - All Content from Followed Accounts */}
            {filteredAccounts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Rss className="w-6 h-6 text-[#CF3232]" />
                    <h2 className="text-2xl font-bold text-[#101117]">Latest Content Feed</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Combined feed from all accounts you follow
                  </p>
                </div>

                {/* Combined Feed Items */}
                <div className="divide-y divide-gray-100">
                  {filteredAccounts.map((account) => 
                    account.rss_feeds.map((feed) =>
                      feed.latest_items.map((item, itemIndex) => (
                        <div key={`${account.id}-${feed.id}-${itemIndex}`} className="p-6 hover:bg-[#FFF9F9] transition-colors">
                          {/* Account Info */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image 
                                src={account.profile_picture} 
                                alt={account.full_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-[#101117] text-sm truncate">
                                  {account.full_name}
                                </h3>
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">@{account.username}</span>
                              </div>
                              <p className="text-xs text-gray-500 flex items-center mt-0.5">
                                <Rss className="w-3 h-3 mr-1" />
                                {feed.title}
                              </p>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(item.pubDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="ml-13">
                            <h4 className="text-lg font-semibold text-[#101117] mb-2 hover:text-[#CF3232] transition-colors">
                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                {item.title}
                              </a>
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <a 
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-[#CF3232] hover:text-[#a82828] font-medium transition-colors"
                            >
                              Read more
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))
                    )
                  )}
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
