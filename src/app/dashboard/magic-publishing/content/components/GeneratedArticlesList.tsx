"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Eye, RefreshCw, RotateCcw, X, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import MagicPublishingForm from './MagicPublishingForm';
import ArticlesModal from '@/components/ui/ArticlesModal';

// interface Article {
//   title: string;
//   content: string;
//   hashtags: string;
//   meta_description: string;
// }

interface GenerationRequest {
  id: number;
  title: string;
  content_type: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  duration: string;
  request_id: string;
  requested_count: number;
  generated_count: number;
  items_with_images: number;
  completion_percentage: number;
  generation_params: Record<string, unknown>;
  error_message: string;
  preview: string;
}

// GeneratedContent interface is now imported from the hook

const GeneratedArticlesList: React.FC = () => {
  const { generatedContents, handleDeleteContent, refreshContent, fetchAllGenerationRequests } = useMagicPublishing();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  // const [currentPage, setCurrentPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const [selectedContentForModal, setSelectedContentForModal] = useState<{ id: string; title: string } | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Initial load - fetch all generation requests
  useEffect(() => {
    console.log('Initial load - fetching all generation requests...');
    fetchAllGenerationRequests();
  }, [fetchAllGenerationRequests]);

  // Close dropdown when clicking outside
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

  // Smart polling - only for pending content every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const pendingContents = generatedContents.filter(content => content.status === 'pending');

      if (pendingContents.length > 0) {
        console.log(`[Auto-polling] Refreshing ${pendingContents.length} pending content at ${new Date().toLocaleTimeString()}`);
        setIsRefreshing(true);

        // Refresh each pending content individually
        for (const content of pendingContents) {
          await refreshContent(content.id.toString());
        }

        setIsRefreshing(false);
      } else {
        console.log('[Auto-polling] No pending content to refresh');
      }
    }, 10000); // 10 seconds as requested

    return () => clearInterval(interval);
  }, [generatedContents, refreshContent]);

  // const handleDelete = async (contentId: string) => {
  //   if (window.confirm('Are you sure you want to delete this generated content?')) {
  //     await handleDeleteContent(contentId);
  //   }
  // };

  const handleViewArticles = (contentId: string, title: string) => {
    console.log('View Articles clicked:', contentId, title);
    setSelectedContentForModal({ id: contentId, title });
    setShowArticlesModal(true);
    setOpenDropdownId(null);
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

  // const handleDownloadArticle = (article: Article) => {
  //   // Download article as text file
  //   const element = document.createElement('a');
  //   const file = new Blob([`${article.title}\n\n${article.content}\n\n${article.hashtags}\n\n${article.meta_description}`], {type: 'text/plain'});
  //   element.href = URL.createObjectURL(file);
  //   element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };

  // Filter content based on status
  const filteredContents = statusFilter
    ? generatedContents.filter(content => content.status === statusFilter)
    : generatedContents;

  // Group content by content_id (using id as content_id for now)
  const groupedContents = filteredContents.reduce((groups, content) => {
    const key = content.id.toString();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(content);
    return groups;
  }, {} as Record<string, GenerationRequest[]>);

  // Handle regenerate button click
  const handleRegenerate = (contentId: number) => {
    console.log('handleRegenerate called with contentId:', contentId);
    setSelectedContentId(contentId);
    setShowRegenerateForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (contentId: number) => {
    setContentToDelete(contentId);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (contentToDelete) {
      await handleDeleteContent(contentToDelete.toString());
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setContentToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#101117]">
          Generated Articles
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {filteredContents.length} of {generatedContents.length} content{generatedContents.length !== 1 ? 's' : ''} generated
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedContents).map(([contentId, contents]) => {
            const mainContent = contents[0]; // Use first content as main
            return (
              <div key={contentId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => mainContent.status === 'completed' && handleViewArticles(contentId, mainContent.title)}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#101117] mb-2 line-clamp-2">
                      {mainContent.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mainContent.status)}`}>
                        {mainContent.status}
                      </span>
                      <span className="text-blue-600 text-sm font-medium">
                        {mainContent.generated_count} articles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {mainContent.preview && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm line-clamp-2">{mainContent.preview}</p>
                  </div>
                )}

                {/* Status specific content */}
                {mainContent.status === 'pending' && (
                  <div className="text-center py-4 mb-4">
                    {/* Enhanced loading animation */}
                    <div className="relative mb-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-red-600 mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-pulse w-2 h-2 bg-red-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 animate-pulse"
                        style={{ width: `${Math.max(10, mainContent.completion_percentage || 0)}%` }}
                      ></div>
                    </div>

                    <p className="text-gray-600 text-sm font-medium">Generating articles...</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {mainContent.completion_percentage > 0 ? `${mainContent.completion_percentage}% complete` : 'Processing...'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Duration: {mainContent.duration}
                    </p>
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

                {/* Action Menu */}
                <div className="flex justify-end pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <div className="relative dropdown-container">
                    <button
                      onClick={(e) => handleDropdownToggle(contentId, e)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openDropdownId === contentId && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          {mainContent.status === 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewArticles(contentId, mainContent.title);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-3 text-green-600" />
                              View Articles
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerateFromDropdown(mainContent.id);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4 mr-3 text-blue-600" />
                            Regenerate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFromDropdown(mainContent.id);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-3 text-red-600" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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

      {/* Articles Modal */}
      {selectedContentForModal && (
        <ArticlesModal
          isOpen={showArticlesModal}
          onClose={() => {
            setShowArticlesModal(false);
            setSelectedContentForModal(null);
          }}
          contentId={selectedContentForModal.id}
          title={selectedContentForModal.title}
        />
      )}
    </div>
  );
};

export default GeneratedArticlesList;
