"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Download, Copy, ExternalLink, Loader2, Search, Filter, Calendar, SortAsc, SortDesc } from 'lucide-react';
import { getAllContent } from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';
import LinkedInPostPage from '@/components/preview/LinkedinPreview';
import FacebookPostPage from '@/components/preview/FacebookPreview';
import TwitterPostPage from '@/components/preview/TwitterPreview';
import NewsletterPage from '@/components/preview/NewsLetterPreview';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
  article_image?: string;
  image_alt_text?: string;
  image_description?: string;
}

interface ContentItem {
  id: number;
  title: string;
  slug: string;
  content_type: string;
  status: string;
  created_at: string;
  completed_at: string;
  updated_at: string;
  request_id: string;
  generated_content: { articles: Article[] } | Article | boolean | null;
  generated_content_json: string;
  content_preview: string;
  content_summary: string;
  word_count: number;
  error_message: string;
  tags: string[];
  categories: string[];
}

interface ArticlesListProps {
  onArticleSelect?: (article: Article) => void;
  refreshTrigger?: number; // Add a refresh trigger prop
  processingContentIds?: Set<string>; // Add processing content IDs from hook
}

const ArticlesList: React.FC<ArticlesListProps> = ({ refreshTrigger, processingContentIds }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showFilters, setShowFilters] = useState(false);
  
  // Applied filter states (used for API calls)
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  
  // Temporary filter states (used for UI inputs)
  const [tempStatusFilter, setTempStatusFilter] = useState('');
  const [tempDateFrom, setTempDateFrom] = useState('');
  const [tempDateTo, setTempDateTo] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [, setHasMore] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const options = {
        search: searchTerm || undefined,
        status: appliedStatusFilter || undefined,
        date_from: appliedDateFrom || undefined,
        date_to: appliedDateTo || undefined,
        order: sortOrder,
        page: currentPage,
        per_page: 10,
      };

      const response = await getAllContent('articles', token, options);

      if (response.success && response.data && response.data.content) {
        const allArticles: Article[] = [];
        const allContentItems: ContentItem[] = response.data.content;
        
        // Process each content item - only get articles from completed ones
        response.data.content.forEach((contentItem: ContentItem) => {
          // Only process completed items for articles display
          if (contentItem.status === 'completed') {
            // Try to get articles from generated_content first
            if (contentItem.generated_content && typeof contentItem.generated_content === 'object') {
              // Check if generated_content has articles array
              if ('articles' in contentItem.generated_content && Array.isArray(contentItem.generated_content.articles)) {
                allArticles.push(...contentItem.generated_content.articles);
              }
              // If generated_content is directly an article object
              else if ('title' in contentItem.generated_content && 'content' in contentItem.generated_content) {
                allArticles.push(contentItem.generated_content as Article);
              }
            } 
            // Fallback to generated_content_json
            else if (contentItem.generated_content_json) {
              try {
                const parsedContent = JSON.parse(contentItem.generated_content_json);
                if (parsedContent.articles && Array.isArray(parsedContent.articles)) {
                  allArticles.push(...parsedContent.articles);
                }
              } catch (parseError) {
                console.error('Error parsing generated content JSON:', parseError);
              }
            }
          }
        });
        
        setArticles(allArticles);
        setContentItems(allContentItems);
        
        // Extract pagination info
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.total_pages);
          setTotalItems(response.data.pagination.total_items);
          setHasMore(response.data.pagination.has_more);
        }
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder, currentPage]);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for other changes

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchArticles]);

  // Effect for applied filters and sort order
  useEffect(() => {
    fetchArticles();
  }, [appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder, fetchArticles]);

  // Effect for refresh trigger
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchArticles();
    }
  }, [refreshTrigger, fetchArticles]);

  // Handle apply filters
  const handleApplyFilters = () => {
    setAppliedStatusFilter(tempStatusFilter);
    setAppliedDateFrom(tempDateFrom);
    setAppliedDateTo(tempDateTo);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setTempStatusFilter('');
    setTempDateFrom('');
    setTempDateTo('');
    setAppliedStatusFilter('');
    setAppliedDateFrom('');
    setAppliedDateTo('');
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const handleCopyArticle = (article: Article) => {
    const fullText = `${article.title}\n\n${article.content}\n\n${article.hashtags}\n\nMeta Description: ${article.meta_description}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Article copied to clipboard!');
  };

  const handleDownloadArticle = (article: Article, index: number) => {
    const fullText = `${article.title}\n\n${article.content}\n\n${article.hashtags}\n\nMeta Description: ${article.meta_description}`;
    const element = document.createElement('a');
    const file = new Blob([fullText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `article_${index + 1}_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Article downloaded!');
  };

  const handlePreviewClick = (platform: string, article: Article) => {
    setSelectedArticle(article);
    setActivePreview(platform);
  };

  const handleBackToList = () => {
    setActivePreview(null);
    setSelectedArticle(null);
  };

  // Show preview components when a platform is selected
  if (activePreview === 'linkedin' && selectedArticle) {
    return <LinkedInPostPage article={selectedArticle} onBack={handleBackToList} />;
  }

  if (activePreview === 'facebook' && selectedArticle) {
    return <FacebookPostPage article={selectedArticle} onBack={handleBackToList} />;
  }

  if (activePreview === 'twitter' && selectedArticle) {
    return <TwitterPostPage article={selectedArticle} onBack={handleBackToList} />;
  }

  if (activePreview === 'newsletter' && selectedArticle) {
    return <NewsletterPage article={selectedArticle} onBack={handleBackToList} />;
  }

  // Filter processing and failed items - ensure completed items are excluded
  const processingItems = contentItems.filter(item => {
    // Check if item is in processing state
    const isProcessing = item.status === 'processing';
    
    // Double check: if item has generated_content with articles, it's NOT processing
    if (item.generated_content && typeof item.generated_content === 'object' && 'articles' in item.generated_content) {
      return false;
    }
    
    // Also check if this content_id is in the processingContentIds set from hook
    const isInProcessingSet = processingContentIds && processingContentIds.has(item.id.toString());
    
    return isProcessing || isInProcessingSet;
  });
  
  const failedItems = contentItems.filter(item => item.status === 'failed');

  return (
    <div className="space-y-6">
      {/* Search and Filter Section - Always Visible */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-[#333333] font-outfit pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
            />
          </div>

          {/* Filter Toggle and Sort */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="flex text-[#333333] font-outfit items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'ASC' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'ASC' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="hidden sm:inline">{sortOrder === 'ASC' ? 'Oldest' : 'Newest'}</span>
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-[#cf3232] text-white border-[#cf3232]' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>Status</label>
                <select
                  value={tempStatusFilter}
                  onChange={(e) => setTempStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333] font-outfit text-sm"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={tempDateFrom}
                    onChange={(e) => setTempDateFrom(e.target.value)}
                    className="pl-10 text-[#333333] font-outfit pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
                  />
                </div>
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#333333' }}>To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={tempDateTo}
                    onChange={(e) => setTempDateTo(e.target.value)}
                    className="pl-10 text-[#333333] font-outfit pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-[#cf3232] text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-[#cf3232] mb-4">
            <ExternalLink className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Articles</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {/* Content Area - Only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Processing Items */}
          {processingItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#101117]">
                Processing Content ({processingItems.length})
              </h3>
              {processingItems.map((item) => (
                <div key={item.id} className="mb-4 p-6 bg-gradient-to-br from-[#f9efef] via-[#fee3e3] to-gray-50 rounded-xl border-2 border-gray-300 shadow-lg relative overflow-hidden">
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
                          style={{ width: `${Math.max(15, 50)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                          <div className="absolute inset-0 blur-sm bg-gradient-to-r from-[#cf3232] via-gray-400 to-gray-500 opacity-50"></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30 animate-pulse"></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-base font-bold text-[#333333]">
                            Processing...
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
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="text-lg animate-bounce">✨</span>
                        <p className="text-sm text-[#333333] font-medium">
                          {item.title} - Creating amazing content for you. This usually takes a few moments...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Failed Items */}
          {failedItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#101117]">
                Failed Content ({failedItems.length})
              </h3>
              {failedItems.map((item) => (
                <div key={item.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-red-600 text-xl">❌</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800">{item.title}</h4>
                      <p className="text-sm text-red-600">
                        {item.error_message || 'Content generation failed'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Content Found - Only show when no articles AND no processing/failed items */}
          {articles.length === 0 && processingItems.length === 0 && failedItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
              <p className="text-gray-600">No content was found matching your criteria.</p>
            </div>
          )}

          {articles.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">
                  Generated Articles ({articles.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {articles.length} article{articles.length !== 1 ? 's' : ''} ready
                </div>
              </div>

              {/* Google Docs Style Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {articles.map((article, index) => (
                  <div 
                    key={index} 
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    {/* Document Preview - Top Section */}
                    <div className="relative bg-white border-b border-gray-200 h-48 overflow-hidden">
                      {/* Article Image or Document Lines Preview */}
                      {article.article_image && article.article_image.trim() !== '' ? (
                        <img 
                          src={article.article_image} 
                          alt={article.image_alt_text || article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to document lines if image fails to load
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'p-4 space-y-2';
                              fallback.innerHTML = `
                                <div class="h-4 bg-gray-900 rounded w-3/4"></div>
                                <div class="h-2 bg-gray-300 rounded w-full"></div>
                                <div class="h-2 bg-gray-300 rounded w-5/6"></div>
                                <div class="h-2 bg-gray-300 rounded w-full"></div>
                                <div class="h-2 bg-gray-300 rounded w-4/5"></div>
                                <div class="h-2 bg-gray-300 rounded w-full"></div>
                                <div class="h-2 bg-gray-300 rounded w-3/4"></div>
                              `;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-gray-900 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                          <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                          <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      )}
                      
                      {/* Hover Overlay with Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyArticle(article);
                          }}
                          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                          title="Copy article"
                        >
                          <Copy className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadArticle(article, index);
                          }}
                          className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                          title="Download article"
                        >
                          <Download className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* Document Info - Bottom Section */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold text-[#101117] mb-2 line-clamp-2 flex-1">
                        {article.title}
                      </h3>
                      
                      {/* Document Icon and Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                          <span>Article</span>
                        </div>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>

                      {/* Preview Buttons - Compact */}
                      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick('linkedin', article);
                          }}
                          className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                        >
                          LinkedIn
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick('twitter', article);
                          }}
                          className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                        >
                          X
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick('facebook', article);
                          }}
                          className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewClick('newsletter', article);
                          }}
                          className="px-2 py-1.5 bg-[#cf3232] hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Newsletter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalItems} total items)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];
                
                // Always show first page
                if (totalPages > 0) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? 'bg-[#CF3232] text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      1
                    </button>
                  );
                }
                
                // Add ellipsis if there's a gap after first page
                if (currentPage > 3) {
                  pages.push(
                    <span key="ellipsis1" className="px-2 py-2 text-sm text-gray-500">
                      ...
                    </span>
                  );
                }
                
                // Add pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                
                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? 'bg-[#CF3232] text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                }
                
                // Add ellipsis if there's a gap before last page
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <span key="ellipsis2" className="px-2 py-2 text-sm text-gray-500">
                      ...
                    </span>
                  );
                }
                
                // Always show last page (if more than 1 page)
                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? 'bg-[#CF3232] text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pages;
              })()}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;