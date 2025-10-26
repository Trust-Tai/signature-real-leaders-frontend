"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MagicPublishingFormProps {
  onClose?: () => void;
  contentId?: number | null;
}

const MagicPublishingForm: React.FC<MagicPublishingFormProps> = ({ onClose, contentId }) => {
  const { handleGenerateArticles, isGenerating, error } = useMagicPublishing();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    articleCount: 200,
    articleLength: 1000,
    tone: 'professional',
    focusTopics: [] as string[],
    includeHashtags: true,
    platformOptimization: 'general'
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        article_count: formData.articleCount,
        article_length: formData.articleLength,
        tone: formData.tone,
        focus_topics: formData.focusTopics,
        include_hashtags: formData.includeHashtags,
        platform_optimization: formData.platformOptimization
      };

      console.log('[Form] Submitting article generation request:', requestData);
      const response = await handleGenerateArticles(requestData);
      
      // Navigate to article detail page if generation started successfully
      if (response && response.content_id) {
        console.log('[Form] Navigating to article detail page:', response.content_id);
        router.push(`/dashboard/magic-publishing/content/${response.content_id}`);
      }
      
      // Close the form after successful submission
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('[Form] Error submitting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#101117]">
          {contentId ? 'Regenerate Articles' : 'Magic Publishing (Articles)'}
        </h2>
        {onClose && !contentId && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Article Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Count
          </label>
          <Input
            type="number"
            value={formData.articleCount}
            onChange={(e) => handleInputChange('articleCount', parseInt(e.target.value))}
            placeholder="Number of articles to generate"
            className="w-full text-sm"
            size="sm"
          />
        </div>

        {/* Article Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Length
          </label>
          <Input
            type="number"
            value={formData.articleLength}
            onChange={(e) => handleInputChange('articleLength', parseInt(e.target.value))}
            placeholder="Words per article"
            className="w-full text-sm"
            size="sm"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            value={formData.tone}
            onChange={(e) => handleInputChange('tone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            style={{ color: '#333333' }}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
          </select>
        </div>

        {/* Platform Optimization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform Optimization
          </label>
          <select
            value={formData.platformOptimization}
            onChange={(e) => handleInputChange('platformOptimization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            style={{ color: '#333333' }}
          >
            <option value="general">General</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </div>

      {/* Include Hashtags */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="includeHashtags"
          checked={formData.includeHashtags}
          onChange={(e) => handleInputChange('includeHashtags', e.target.checked)}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <label htmlFor="includeHashtags" className="text-sm font-medium text-gray-700">
          Include Hashtags
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          variant="outline"
          onClick={() => {
            setFormData({
              articleCount: 200,
              articleLength: 1000,
              tone: 'professional',
              focusTopics: [],
              includeHashtags: true,
              platformOptimization: 'general'
            });
          }}
          className="px-6 py-2"
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isGenerating}
          className="px-6 py-2 bg-[#CF3232] hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Starting Generation...</span>
            </div>
          ) : (
            contentId ? 'Regenerate Articles' : 'Start Magic ✨'
          )}
        </Button>
      </div>
    </div>
  );
};

export default MagicPublishingForm;
