"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Users, Globe, BookOpen, Mic, Info, ArrowLeft } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { useParams, useRouter } from 'next/navigation';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import ArticlesList from '../components/ArticlesList';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { GenerationRequest } from '@/lib/magicPublishingApi';

const ContentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const contentId = params.content_id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { generatedContents, refreshContent, fetchAllGenerationRequests } = useMagicPublishing();
  const [currentContent, setCurrentContent] = useState<GenerationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Find the current content by ID
  useEffect(() => {
    const findContent = () => {
      const content = generatedContents.find(c => c.id.toString() === contentId);
      setCurrentContent(content || null);
      setIsLoading(false);
    };

    if (generatedContents.length > 0) {
      findContent();
    } else {
      // If no content loaded yet, fetch all
      fetchAllGenerationRequests().then(() => {
        findContent();
      });
    }
  }, [contentId, generatedContents, fetchAllGenerationRequests]);

  // Auto-refresh if content is processing
  useEffect(() => {
    if (currentContent?.status === 'processing') {
      const interval = setInterval(() => {
        refreshContent(contentId);
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [currentContent?.status, contentId, refreshContent]);

  if (isLoading) {
    return (
      <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <UserProfileSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="magic-publishing-content"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <UserProfileSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="magic-publishing-content"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Content Not Found</h2>
            <p className="text-gray-600 mb-4">The requested content could not be found.</p>
            <div 
            onClick={()=>router.push("/dashboard/magic-publishing/content")}
              className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Content List
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-gray-600 bg-gray-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-content"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              {/* Back Button */}
              <div 
              onClick={()=>router.push("/dashboard/magic-publishing/content")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </div>
              
              <div>
                <h1 
                  className="text-[#101117] text-lg sm:text-xl font-semibold" 
                  style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
                >
                  {currentContent.title}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentContent.status)}`}>
                    {currentContent.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentContent.generated_count} articles
                  </span>
                </div>
              </div>
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
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span>
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span>
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="sm:hidden mt-4">
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
            
            {/* Content Status Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-[#101117]">Content Details</h2>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                  <div 
                  onClick={()=>router.push("/dashboard/magic-publishing/content")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to List
                  </div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/setup")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Setup</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/content")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#CF3232] text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Content</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/books")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Books</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/podcasts")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  <span>Podcasts</span>
                </div>
              </div>

              {/* Content Status Display */}
              {currentContent.status === 'processing' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#cf3232]"></div>
                    
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-[#333333] mb-2">
                        Processing {currentContent.requested_count} articles...
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-[#cf3232] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, currentContent.completion_percentage || 5)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {currentContent.completion_percentage > 0 
                            ? `${currentContent.completion_percentage}% complete` 
                            : 'Starting...'
                          }
                        </span>
                        <span>Duration: {currentContent.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            

              {currentContent.status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="text-red-600 text-2xl">❌</div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">
                        Generation Failed
                      </h3>
                      <p className="text-red-700">
                        {currentContent.error_message || 'An error occurred during article generation.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Articles Display - Only show if completed */}
            {currentContent.status === 'completed' && (
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <ArticlesList contentId={contentId} />
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

export default ContentDetailPage;