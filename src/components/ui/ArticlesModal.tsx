"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Copy, Eye, EyeOff } from 'lucide-react';
import { getGeneratedContent } from '@/lib/magicPublishingApi';
import { toast } from './toast';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

interface ArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  title: string;
}

const ArticlesModal: React.FC<ArticlesModalProps> = ({ isOpen, onClose, contentId, title }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      console.log('[ArticlesModal] Fetching articles for content ID:', contentId);
      const response = await getGeneratedContent(contentId, token);
      
      if (response.success && response.content) {
        if (response.content.generated_content?.articles) {
          setArticles(response.content.generated_content.articles);
          console.log('[ArticlesModal] Loaded articles:', response.content.generated_content.articles.length);
        } else if (response.content.generated_content_json) {
          // Try parsing JSON if articles not directly available
          try {
            const parsedContent = JSON.parse(response.content.generated_content_json);
            if (parsedContent.articles) {
              setArticles(parsedContent.articles);
            }
          } catch (parseError) {
            console.error('[ArticlesModal] Error parsing generated content JSON:', parseError);
            setError('Error parsing article content');
          }
        } else {
          setError('No articles found in the generated content');
        }
      } else {
        setError('Failed to fetch articles');
      }
    } catch (error) {
      console.error('[ArticlesModal] Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchArticles();
    }
  }, [isOpen, contentId, fetchArticles]);

  const handleDownloadArticle = (article: Article, index: number) => {
    const content = `${article.title}\n\n${article.content}\n\n${article.hashtags}\n\nMeta Description: ${article.meta_description}`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `article_${index + 1}_${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Article downloaded successfully');
  };

  const handleDownloadAll = () => {
    const allContent = articles.map((article, index) => 
      `ARTICLE ${index + 1}\n${'='.repeat(50)}\n\nTitle: ${article.title}\n\nContent:\n${article.content}\n\nHashtags: ${article.hashtags}\n\nMeta Description: ${article.meta_description}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const element = document.createElement('a');
    const file = new Blob([allContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `all_articles_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success(`Downloaded ${articles.length} articles successfully`);
  };

  const handleCopyArticle = (article: Article) => {
    const content = `${article.title}\n\n${article.content}\n\n${article.hashtags}`;
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Article copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy article');
    });
  };

  const toggleArticleExpansion = (index: number) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading articles...' : `${articles.length} articles generated`}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {articles.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading articles...</span>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={fetchArticles}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found</p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="p-6 space-y-6">
              {articles.map((article, index) => {
                const isExpanded = expandedArticles.has(index);
                const previewContent = article.content.length > 200 
                  ? article.content.substring(0, 200) + '...' 
                  : article.content;

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Article Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {index + 1}. {article.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{article.content.length} characters</span>
                          <span>•</span>
                          <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleArticleExpansion(index)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyArticle(article)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadArticle(article, index)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download article"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="prose max-w-none">
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {isExpanded ? article.content : previewContent}
                        </p>
                        {!isExpanded && article.content.length > 200 && (
                          <button
                            onClick={() => toggleArticleExpansion(index)}
                            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Read more
                          </button>
                        )}
                      </div>

                      {/* Hashtags */}
                      {article.hashtags && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Hashtags:</p>
                          <p className="text-blue-600 text-sm">{article.hashtags}</p>
                        </div>
                      )}

                      {/* Meta Description */}
                      {article.meta_description && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Meta Description:</p>
                          <p className="text-gray-600 text-sm italic">{article.meta_description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesModal;