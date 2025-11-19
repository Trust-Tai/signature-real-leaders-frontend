"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Copy, Search, Filter, Calendar, SortAsc, SortDesc } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { getAllContent } from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';
import LinkedInPostPage from '@/components/preview/LinkedinPreview';
import FacebookPostPage from '@/components/preview/FacebookPreview';
import TwitterPostPage from '@/components/preview/TwitterPreview';
import InstagramPostPage from '@/components/preview/InstagramPreview';

interface SocialPost {
  platform: string;
  hook_line: string;
  content: string;
  call_to_action: string;
  hashtags: string;
  visual_description: string;
  engagement_tip: string;
}

interface SocialPostsGroup {
  social_posts: SocialPost[];
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
  generated_content: SocialPostsGroup | { social_posts: SocialPost[] } | boolean | null;
  generated_content_json: string;
  content_preview: string;
  content_summary: string;
  word_count: number;
  error_message: string;
  tags: string[];
  categories: string[];
}

interface SocialPostsListProps {
  refreshTrigger?: number;
}


const SocialPostsList: React.FC<SocialPostsListProps> = ({ refreshTrigger }) => {
  const [socialPostsGroups, setSocialPostsGroups] = useState<SocialPostsGroup[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showFilters, setShowFilters] = useState(false);
  
  // Applied filter states
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  
  // Temporary filter states
  const [tempStatusFilter, setTempStatusFilter] = useState('');
  const [tempDateFrom, setTempDateFrom] = useState('');
  const [tempDateTo, setTempDateTo] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSocialPosts = useCallback(async () => {
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

      const response = await getAllContent('social_posts', token, options);

      if (response.success && response.data && response.data.content) {
        console.log('[SocialPostsList] Received content items:', response.data.content.length);
        const allSocialPostsGroups: SocialPostsGroup[] = [];
        const allContentItems: ContentItem[] = response.data.content;
        
        // Process each content item
        response.data.content.forEach((contentItem: ContentItem) => {
          if (contentItem.status === 'completed') {
            if (contentItem.generated_content && typeof contentItem.generated_content === 'object') {
              if ('social_posts' in contentItem.generated_content && Array.isArray(contentItem.generated_content.social_posts)) {
                allSocialPostsGroups.push({ social_posts: contentItem.generated_content.social_posts });
              }
            } else if (contentItem.generated_content_json) {
              try {
                const parsedContent = JSON.parse(contentItem.generated_content_json);
                if (parsedContent.social_posts && Array.isArray(parsedContent.social_posts)) {
                  allSocialPostsGroups.push({ social_posts: parsedContent.social_posts });
                }
              } catch (parseError) {
                console.error('Error parsing generated content JSON:', parseError);
              }
            }
          }
        });

        console.log('[SocialPostsList] Processed groups:', allSocialPostsGroups.length);
        setSocialPostsGroups(allSocialPostsGroups);
        setContentItems(allContentItems);
        
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.total_pages);
          setTotalItems(response.data.pagination.total_items);
        }
      } else {
        setError('Failed to fetch social posts');
      }
    } catch (fetchError) {
      console.error('Error fetching social posts:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSocialPosts();
    }, searchTerm ? 500 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSocialPosts]);

  useEffect(() => {
    fetchSocialPosts();
  }, [appliedStatusFilter, appliedDateFrom, appliedDateTo, sortOrder, fetchSocialPosts]);

  useEffect(() => {
    if (refreshTrigger) {
      console.log('[SocialPostsList] Refresh trigger changed, fetching...');
      fetchSocialPosts();
    }
  }, [refreshTrigger, fetchSocialPosts]);

  const handleApplyFilters = () => {
    setAppliedStatusFilter(tempStatusFilter);
    setAppliedDateFrom(tempDateFrom);
    setAppliedDateTo(tempDateTo);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTempStatusFilter('');
    setTempDateFrom('');
    setTempDateTo('');
    setAppliedStatusFilter('');
    setAppliedDateFrom('');
    setAppliedDateTo('');
    setCurrentPage(1);
  };

  // Unused function - kept for future use
  // const handleCopyPost = (post: SocialPost) => {
  //   const fullText = `${post.hook_line}\n\n${post.content}\n\n${post.call_to_action}\n\n${post.hashtags}`;
  //   navigator.clipboard.writeText(fullText);
  //   toast.success(`${post.platform} post copied to clipboard!`);
  // };

  const handlePreview = (platform: string, post: SocialPost) => {
    setSelectedPost(post);
    setActivePreview(platform.toLowerCase());
  };

  const handleClosePreview = () => {
    setActivePreview(null);
    setSelectedPost(null);
  };

  const processingItems = contentItems.filter(item => item.status === 'processing');
  const failedItems = contentItems.filter(item => item.status === 'failed');

  // Preview Components
  if (activePreview === 'linkedin' && selectedPost) {
    return <LinkedInPostPage article={{ title: selectedPost.hook_line, content: selectedPost.content, hashtags: selectedPost.hashtags, meta_description: '' }} onBack={handleClosePreview} />;
  }
  if (activePreview === 'facebook' && selectedPost) {
    return <FacebookPostPage article={{ title: selectedPost.hook_line, content: selectedPost.content, hashtags: selectedPost.hashtags, meta_description: '' }} onBack={handleClosePreview} />;
  }
  if (activePreview === 'twitter' && selectedPost) {
    return <TwitterPostPage article={{ title: selectedPost.hook_line, content: selectedPost.content, hashtags: selectedPost.hashtags, meta_description: '' }} onBack={handleClosePreview} />;
  }
  if (activePreview === 'instagram' && selectedPost) {
    return <InstagramPostPage article={{ title: selectedPost.hook_line, content: selectedPost.content, hashtags: selectedPost.hashtags, meta_description: '' }} onBack={handleClosePreview} />;
  }


  if (isLoading && socialPostsGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#cf3232]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping w-6 h-6 bg-[#cf3232] rounded-full opacity-75"></div>
          </div>
        </div>
        <h4 className="text-lg font-semibold text-[#101117] mb-2">Loading Social Posts...</h4>
        <p className="text-gray-500 text-center max-w-md mx-auto">
          Fetching your social posts from the server. This may take a moment.
        </p>
        <div className="flex space-x-1 justify-center mt-4">
          <span className="animate-bounce inline-block w-2 h-2 bg-[#cf3232] rounded-full" style={{ animationDelay: '0ms' }}></span>
          <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '150ms' }}></span>
          <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchSocialPosts}
          className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search social posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'ASC' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            <span>{sortOrder === 'ASC' ? 'Oldest' : 'Newest'}</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={tempStatusFilter}
                onChange={(e) => setTempStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={tempDateFrom}
                onChange={(e) => setTempDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={tempDateTo}
                onChange={(e) => setTempDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Processing Items - Attractive Loader */}
      {processingItems.map((item) => (
        <div key={`processing-${item.id}`} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-yellow-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping w-4 h-4 bg-yellow-600 rounded-full opacity-75"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full animate-pulse">
                  Generating...
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{item.content_preview}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Started: {new Date(item.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-2 flex-1 bg-yellow-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Failed Items */}
      {failedItems.map((item) => (
        <div key={`failed-${item.id}`} className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-sm text-red-600 mt-1">{item.error_message || 'Generation failed'}</p>
              <p className="text-xs text-gray-500 mt-2">
                Failed: {new Date(item.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}


      {/* Completed Social Posts Groups */}
      {socialPostsGroups.length === 0 && processingItems.length === 0 && failedItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLinkedin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No social posts yet</h3>
          <p className="text-gray-600 mb-6">Click &ldquo;Generate Social Posts&rdquo; to create your first set of posts.</p>
        </div>
      ) : (
        socialPostsGroups.map((group, groupIndex) => {
          // Get one post from each platform
          const linkedinPost = group.social_posts.find(p => p.platform.toLowerCase() === 'linkedin');
          const twitterPost = group.social_posts.find(p => p.platform.toLowerCase() === 'twitter');
          const facebookPost = group.social_posts.find(p => p.platform.toLowerCase() === 'facebook');
          const instagramPost = group.social_posts.find(p => p.platform.toLowerCase() === 'instagram');

          return (
            <div key={groupIndex} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Social Posts Set #{groupIndex + 1}</h4>
                    <p className="text-sm text-gray-600">{group.social_posts.length} posts across different platforms</p>
                  </div>
                  <button
                    onClick={() => {
                      const allText = group.social_posts.map(p => 
                        `${p.platform.toUpperCase()}\n${p.hook_line}\n\n${p.content}\n\n${p.call_to_action}\n\n${p.hashtags}`
                      ).join('\n\n---\n\n');
                      navigator.clipboard.writeText(allText);
                      toast.success('All posts copied to clipboard!');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All</span>
                  </button>
                </div>

                {/* Preview of first post */}
                {group.social_posts[0] && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{group.social_posts[0].hook_line}</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{group.social_posts[0].content}</p>
                  </div>
                )}

                {/* Platform Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {linkedinPost && (
                    <button
                      onClick={() => handlePreview('linkedin', linkedinPost)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors shadow-sm"
                    >
                      <FaLinkedin className="w-5 h-5" />
                      <span className="font-medium">LinkedIn</span>
                    </button>
                  )}
                  {twitterPost && (
                    <button
                      onClick={() => handlePreview('twitter', twitterPost)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors shadow-sm"
                    >
                      <FaTwitter className="w-5 h-5" />
                      <span className="font-medium">Twitter</span>
                    </button>
                  )}
                  {facebookPost && (
                    <button
                      onClick={() => handlePreview('facebook', facebookPost)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565d8] transition-colors shadow-sm"
                    >
                      <FaFacebook className="w-5 h-5" />
                      <span className="font-medium">Facebook</span>
                    </button>
                  )}
                  {instagramPost && (
                    <button
                      onClick={() => handlePreview('instagram', instagramPost)}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <FaInstagram className="w-5 h-5" />
                      <span className="font-medium">Instagram</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({totalItems} total items)
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-[#CF3232] text-white rounded-lg font-medium">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPostsList;
