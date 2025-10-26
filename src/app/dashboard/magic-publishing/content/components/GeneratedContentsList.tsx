"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, RefreshCw, RotateCcw, X, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import MagicPublishingForm from './MagicPublishingForm';
import { useRouter } from 'next/navigation';

interface GenerationRequest {
  id: number;
  title: string;
  content_type: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  duration: string;
  request_id: string;
  requested_count: number;
  generated_count: number;
  items_with_images: number;
  completion_percentage: number;
  generation_params: Record<string, unknown> | null;
  error_message: string;
  preview: string;
}

const GeneratedArticlesList: React.FC = () => {
  const { generatedContents, handleDeleteContent, refreshContent, fetchAllGenerationRequests } = useMagicPublishing();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const router = useRouter()
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
      const processingContents = generatedContents.filter(content => content.status === 'processing');

      if (processingContents.length > 0) {
        console.log(`[Auto-polling] Refreshing ${processingContents.length} processing content at ${new Date().toLocaleTimeString()}`);
        setIsRefreshing(true);

        for (const content of processingContents) {
          await refreshContent(content.id.toString());
        }

        setIsRefreshing(false);
      } else {
        console.log('[Auto-polling] No processing content to refresh');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [generatedContents, refreshContent]);

  const handleViewArticles = (contentId: string, title: string) => {
    console.log('View Articles clicked:', contentId, title);
    // Navigate to the content detail page
    router.push(`/dashboard/magic-publishing/content/${contentId}`)
    
  };

  const handleDropdownToggle = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Dropdown toggle clicked:', contentId);
    setOpenDropdownId(openDropdownId === contentId ? null : contentId);
  };

  const handleRegenerateFromDropdown = (contentId: number) => {
    console.log('Regenerate clicked:', contentId);
    handleRegenerate(contentId);
    setOpenDropdownId(null);
  };

  const handleDeleteFromDropdown = (contentId: number) => {
    console.log('Delete clicked:', contentId);
    handleDeleteClick(contentId);
    setOpenDropdownId(null);
  };

  const filteredContents = statusFilter
    ? generatedContents.filter(content => content.status === statusFilter)
    : generatedContents;

  const groupedContents = filteredContents.reduce((groups, content) => {
    const key = content.id.toString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(content);
    return groups;
  }, {} as Record<string, GenerationRequest[]>);

  const handleRegenerate = (contentId: number) => {
    console.log('handleRegenerate called with contentId:', contentId);
    setSelectedContentId(contentId);
    setShowRegenerateForm(true);
  };

  const handleDeleteClick = (contentId: number) => {
    setContentToDelete(contentId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (contentToDelete) {
      await handleDeleteContent(contentToDelete.toString());
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setContentToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
                {filteredContents.length} of {generatedContents.length} content{generatedContents.length !== 1 ? 's' : ''} generated
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">All Status</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

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
                {statusFilter ? `No ${statusFilter} articles found` : 'No articles generated yet'}
              </h3>
              <p className="text-gray-500">
                {statusFilter ? 'Try changing the status filter or generate new articles.' : 'Generate your first set of articles using the form above.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedContents).map(([contentId, contents]) => {
                const mainContent = contents[0];
                return (
                  <div
                    key={contentId}
                    className={`bg-white border rounded-lg transition-all duration-300 cursor-pointer group ${mainContent.status === 'processing'
                      ? 'border-gray-300 shadow-lg shadow-gray-100 ring-2 ring-gray-200 ring-opacity-50'
                      : 'border-gray-200 hover:shadow-lg hover:border-[#cf3232]'
                      }`}
                    onClick={() => handleViewArticles(contentId, mainContent.title)}
                  >
                    {/* List Item */}
                    <div className="p-6">
                      {/* Header with Title and Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#101117]">
                              {mainContent.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mainContent.status)}`}>
                              {mainContent.status}
                            </span>
                            <span className="text-gray-400 group-hover:text-[#cf3232] text-xs transition-colors">
                              Click to view details →
                            </span>
                          </div>

                          {/* Article Count */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[#cf3232] text-sm font-medium">
                              {mainContent.generated_count} articles
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">
                              {mainContent.requested_count} requested
                            </span>
                          </div>

                          {/* Preview/Description */}
                          {mainContent.preview && (
                            <p className="text-gray-600 text-sm mb-3">
                              {mainContent.preview}
                            </p>
                          )}


                        </div>

                        {/* Action Menu */}
                        <div className="relative dropdown-container ml-4">
                          <button
                            onClick={(e) => handleDropdownToggle(contentId, e)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openDropdownId === contentId && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRegenerateFromDropdown(mainContent.id);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#f9efef] transition-colors"
                                >
                                  <RotateCcw className="w-4 h-4 mr-3 text-[#cf3232]" />
                                  Regenerate
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFromDropdown(mainContent.id);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#f9efef] transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 mr-3 text-[#cf3232]" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status specific content */}
                      {mainContent.status === "processing" && (
                        <div className="mb-4 p-6 bg-gradient-to-br from-[#f9efef] via-[#fee3e3] to-gray-50 rounded-xl border-2 border-gray-300 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 via-gray-300/10 to-gray-200/10 animate-pulse"></div>

                          <div className="absolute inset-0 rounded-xl">
                            <div className="absolute inset-0 rounded-xl border-2 border-gray-400 opacity-30 animate-ping"></div>
                          </div>

                          <div className="flex items-center space-x-5 relative z-10">
                            <div className="relative flex-shrink-0">
                              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-[#cf3232] shadow-lg"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-ping w-4 h-4 bg-[#cf3232] rounded-full opacity-75"></div>
                              </div>
                              <div className="absolute -inset-2 rounded-full border-2 border-gray-300 opacity-30 animate-pulse"></div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <p className="text-[#333333] font-bold text-lg">🚀 Processing Your Content...</p>
                                <div className="flex space-x-1">
                                  <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full shadow-lg" style={{ animationDelay: '0ms' }}></span>
                                  <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full shadow-lg" style={{ animationDelay: '150ms' }}></span>
                                  <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full shadow-lg" style={{ animationDelay: '300ms' }}></span>
                                </div>
                              </div>

                              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner mb-4">
                                <div
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#cf3232] via-gray-500 to-gray-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                  style={{ width: `${Math.max(15, mainContent.completion_percentage || 15)}%` }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                                  <div className="absolute inset-0 blur-sm bg-gradient-to-r from-[#cf3232] via-gray-400 to-gray-500 opacity-50"></div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30 animate-pulse"></div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <p className="text-base font-bold text-[#333333]">
                                    {mainContent.completion_percentage > 0 ? `${mainContent.completion_percentage}% Complete` : 'Initializing...'}
                                  </p>
                                  <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-[#cf3232] rounded-full animate-pulse"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 bg-gradient-to-r from-[#f9efef] to-[#fee3e3] px-4 py-2 rounded-full shadow-md">
                                  <span className="text-lg">⏱️</span>
                                  <p className="text-sm font-bold text-[#333333]">
                                    {mainContent.duration}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <span className="text-lg animate-bounce">✨</span>
                                <p className="text-sm text-[#333333] font-medium">
                                  Creating amazing content for you. This usually takes a few moments...
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}


                      {mainContent.status === 'failed' && mainContent.error_message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-red-800 text-sm">{mainContent.error_message}</p>
                        </div>
                      )}

                      {mainContent.status === 'completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-green-600">✅</div>
                            <div>
                              <p className="text-green-800 font-medium text-sm">
                                {mainContent.generated_count} articles completed!
                              </p>
                              <p className="text-green-700 text-xs">
                                Duration: {mainContent.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Preview Buttons - Similar to image */}

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                  <div className="text-red-600 mr-3">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Content</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this content? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={cancelDelete}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-[#cf3232] hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Regenerate Form Modal */}
          {showRegenerateForm && (
            <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Regenerate Articles</h3>
                    <button
                      onClick={() => {
                        setShowRegenerateForm(false);
                        setSelectedContentId(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <MagicPublishingForm
                    onClose={() => {
                      setShowRegenerateForm(false);
                      setSelectedContentId(null);
                    }}
                    contentId={selectedContentId}
                  />
                </div>
              </div>
            </div>
          )}


        </>
      )}
    </div>
  );
};

export default GeneratedArticlesList;