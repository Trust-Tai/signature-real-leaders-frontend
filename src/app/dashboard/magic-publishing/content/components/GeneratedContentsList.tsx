"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import ArticlesList from './ArticlesList';

interface GenerationRequest {
  id: number;
  title: string;
  content_type: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  duration?: string;
  request_id: string;
  requested_count?: number;
  generated_count?: number;
  items_with_images?: number;
  completion_percentage?: number;
  generation_params?: Record<string, unknown> | null;
  error_message: string;
  preview?: string;
}

interface GeneratedArticlesListProps {
  refreshTrigger?: number;
}

const GeneratedArticlesList: React.FC<GeneratedArticlesListProps> = ({ refreshTrigger: externalRefreshTrigger }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Update internal refresh trigger when external one changes
  useEffect(() => {
    if (externalRefreshTrigger !== undefined && externalRefreshTrigger > 0) {
      console.log('[GeneratedArticlesList] External refresh trigger changed to:', externalRefreshTrigger);
      setRefreshTrigger(prev => prev + 1);
    }
  }, [externalRefreshTrigger]);
  
  // Function to trigger ArticlesList refresh - will be called when polling completes
  const triggerArticlesListRefresh = useCallback(() => {
    console.log('[GeneratedArticlesList] Polling completion callback triggered! Refreshing ArticlesList...');
    setRefreshTrigger(prev => {
      const newValue = prev + 1;
      console.log('[GeneratedArticlesList] Setting refreshTrigger to:', newValue);
      return newValue;
    });
  }, []);

  const { generatedContents, refreshContent, fetchAllGenerationRequests } = useMagicPublishing('articles', triggerArticlesListRefresh);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  useEffect(() => {
    console.log('Initial load - fetching all generation requests...');
    const loadData = async () => {
      setIsInitialLoading(true);
      await fetchAllGenerationRequests();
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchAllGenerationRequests]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (openDropdownId && !target.closest('.dropdown-container')) {
        console.log('Clicking outside, closing dropdown');
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Filter processing contents with detailed logging
      const processingContents = generatedContents.filter(content => {
        const isProcessing = content.status === 'processing';
        console.log(`[Auto-polling] Content ${content.id}: status="${content.status}", isProcessing=${isProcessing}`);
        return isProcessing;
      });

      console.log(`[Auto-polling] Total contents: ${generatedContents.length}, Processing: ${processingContents.length}`);

      if (processingContents.length > 0) {
        console.log(`[Auto-polling] Refreshing ${processingContents.length} processing content at ${new Date().toLocaleTimeString()}`);
        setIsRefreshing(true);

        for (const content of processingContents) {
          console.log(`[Auto-polling] Refreshing content ID: ${content.id}`);
          await refreshContent(content.id.toString());
        }

        setIsRefreshing(false);
        
        // After refresh, fetch all to ensure we have latest status
        console.log('[Auto-polling] Fetching all generation requests after refresh...');
        await fetchAllGenerationRequests();
      } else {
        console.log('[Auto-polling] No processing content to refresh - all completed or failed');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [generatedContents, refreshContent, fetchAllGenerationRequests]);



  const groupedContents = generatedContents.reduce((groups, content) => {
    const key = content.id.toString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(content);
    return groups;
  }, {} as Record<string, GenerationRequest[]>);



  return (
    <div className="space-y-6">
      {isInitialLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#cf3232]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping w-4 h-4 bg-[#cf3232] rounded-full opacity-75"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading articles...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your content</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#101117]">
              Generated Articles
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {generatedContents.length} content{generatedContents.length !== 1 ? 's' : ''} generated
              </div>

              <button
                onClick={fetchAllGenerationRequests}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {Object.keys(groupedContents).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles generated yet
              </h3>
              <p className="text-gray-500">
                Generate your first set of articles using the form above.
              </p>
            </div>
          ) : (
          <ArticlesList refreshTrigger={refreshTrigger} />
          )}

         


        </>
      )}
    </div>
  );
};

export default GeneratedArticlesList;