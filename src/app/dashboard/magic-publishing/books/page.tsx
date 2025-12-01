"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Menu,  Plus, ArrowLeft } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter } from 'next/navigation';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import CreateBookModal from '@/components/ui/CreateBookModal';
import BooksList from './components/BooksList';
import { GenerateBookRequest } from '@/lib/magicPublishingApi';
import FeatureAccessGuard from '@/components/ui/FeatureAccessGuard';

const MagicPublishingBooks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  // Function to trigger BooksList refresh - will be called when polling completes
  const triggerBooksListRefresh = useCallback(() => {
    console.log('[Books Page] Polling completion callback triggered! Refreshing BooksList...');
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log('[Books Page] Setting refreshTrigger to:', newValue);
      return newValue;
    });
  }, []);
  
  const {
    isGenerating,
    error,
    handleGenerateBook,
    fetchAllGenerationRequests,
    clearError,
  } = useMagicPublishing('book', triggerBooksListRefresh);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setIsInitialLoading(true);
      await fetchAllGenerationRequests();
      setIsInitialLoading(false);
    };
    loadBooks();
  }, [fetchAllGenerationRequests]);

  const handleCreateBook = async (params: GenerateBookRequest) => {
    console.log('[Books Page] Starting book creation with params:', params);
    const response = await handleGenerateBook(params);
    console.log('[Books Page] Book generation response:', response);
    
    if (response) {
      console.log('[Books Page] Generation started successfully, refreshing content list...');
      // Refresh the content list to show the new processing item
      await fetchAllGenerationRequests();
      
      // Trigger BooksList refresh
      setRefreshTrigger(prev => prev + 1);
      console.log('[Books Page] Content list refreshed, closing modal...');
      
      setIsCreateModalOpen(false);
    } else {
      console.log('[Books Page] No response received from book generation');
    }
  };
  return (
    <FeatureAccessGuard featureName="Magic Publishing - Books">
      <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <UserProfileSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage="magic-publishing-books"
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
              
              {/* Back Arrow */}
              <button
                onClick={() => router.push('/dashboard/magic-publishing')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Back to Content Generator"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#CF3232] transition-colors" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Magic Publishing (Books)
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
                className="pl-10  pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
                style={{ color: '#949494' }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Magic Publishing Header */}
           

            {/* Book Ideas & Content Section */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-[#101117]">Book Ideas & Content</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                  disabled={isGenerating}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Book</span>
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-red-600">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Books List */}
              {isInitialLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#cf3232]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-ping w-6 h-6 bg-[#cf3232] rounded-full opacity-75"></div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-[#101117] mb-2">Loading Books...</h4>
                  <p className="text-gray-500 text-center max-w-md mx-auto">
                    Fetching your books from the server. This may take a moment.
                  </p>
                  <div className="flex space-x-1 justify-center mt-4">
                    <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full" style={{ animationDelay: '0ms' }}></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '150ms' }}></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              ) : (
                <BooksList refreshTrigger={refreshTrigger} />
              )}
            </div>

          </div>
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>

      {/* Create Book Modal */}
      <CreateBookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBook}
        isGenerating={isGenerating}
      />
    </div>
    </FeatureAccessGuard>
  );
};

export default MagicPublishingBooks;
