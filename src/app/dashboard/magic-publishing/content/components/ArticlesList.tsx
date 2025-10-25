"use client";

import React, { useEffect, useState } from 'react';
import { Download, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { getGeneratedContent } from '@/lib/magicPublishingApi';
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
}

interface ArticlesListProps {
  contentId: string;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ contentId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await getGeneratedContent(contentId, token);

        if (response.success && response.content) {
          if (response.content.generated_content?.articles) {
            setArticles(response.content.generated_content.articles);
          } else if (response.content.generated_content_json) {
            // Parse JSON if articles are stored as JSON string
            try {
              const parsedContent = JSON.parse(response.content.generated_content_json);
              if (parsedContent.articles) {
                setArticles(parsedContent.articles);
              }
            } catch (parseError) {
              console.error('Error parsing generated content JSON:', parseError);
              setError('Error parsing article data');
            }
          } else {
            setError('No articles found in the content');
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
    };

    fetchArticles();
  }, [contentId]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4" />
        <p className="text-gray-600">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-[#cf3232] mb-4">
          <ExternalLink className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Articles</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
        <p className="text-gray-600">No articles were found for this content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#101117]">
          Generated Articles ({articles.length})
        </h2>
        <div className="text-sm text-gray-500">
          {articles.length} article{articles.length !== 1 ? 's' : ''} ready
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Article Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#101117] mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {article.meta_description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.hashtags.split(' ').filter(tag => tag.trim()).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-[#fee3e3] text-[#333333] text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleCopyArticle(article)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Copy article"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownloadArticle(article, index)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Download article"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Article Content - Always Visible */}
              <div className="mb-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {article.content}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
            

              {/* Preview Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handlePreviewClick('linkedin', article)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Preview for LinkedIn
                </button>
                <button
                  onClick={() => handlePreviewClick('twitter', article)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Preview for X
                </button>
                <button
                  onClick={() => handlePreviewClick('facebook', article)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Preview for Facebook
                </button>
                <button
                  onClick={() => handlePreviewClick('newsletter', article)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Preview for Newsletter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesList;