"use client";

import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { GenerateSocialPostsRequest } from '@/lib/magicPublishingApi';

interface CreateSocialPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: GenerateSocialPostsRequest) => Promise<void>;
  isGenerating: boolean;
}

const CreateSocialPostModal: React.FC<CreateSocialPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating
}) => {
  const [formData, setFormData] = useState<GenerateSocialPostsRequest>({
    topic: '',
    platforms: 'linkedin,twitter,facebook,instagram',
    post_style: 'professional',
    include_hashtags: true,
    include_emojis: true,
    include_call_to_action: false,
    post_length: 'long'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#101117]">Generate Social Posts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isGenerating}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Business Growth Strategies"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
              required
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((platform) => (
                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.platforms?.includes(platform.toLowerCase()) || false}
                    onChange={(e) => {
                      const platformLower = platform.toLowerCase();
                      const currentPlatforms = formData.platforms?.split(',') || [];
                      const newPlatforms = e.target.checked
                        ? [...currentPlatforms, platformLower]
                        : currentPlatforms.filter(p => p !== platformLower);
                      setFormData({ ...formData, platforms: newPlatforms.join(',') });
                    }}
                    className="w-4 h-4 text-[#cf3232] border-gray-300 rounded focus:ring-[#cf3232]"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Post Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Style
            </label>
            <select
              value={formData.post_style}
              onChange={(e) => setFormData({ ...formData, post_style: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="authoritative">Authoritative</option>
              <option value="conversational">Conversational</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          {/* Post Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Length
            </label>
            <select
              value={formData.post_length}
              onChange={(e) => setFormData({ ...formData, post_length: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf3232] focus:border-[#cf3232] text-[#333333]"
            >
              <option value="short">Short (50-100 words)</option>
              <option value="medium">Medium (100-200 words)</option>
              <option value="long">Long (200+ words)</option>
            </select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.include_hashtags}
                onChange={(e) => setFormData({ ...formData, include_hashtags: e.target.checked })}
                className="w-4 h-4 text-[#cf3232] border-gray-300 rounded focus:ring-[#cf3232]"
              />
              <span className="text-sm text-gray-700">Include Hashtags</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.include_emojis}
                onChange={(e) => setFormData({ ...formData, include_emojis: e.target.checked })}
                className="w-4 h-4 text-[#cf3232] border-gray-300 rounded focus:ring-[#cf3232]"
              />
              <span className="text-sm text-gray-700">Include Emojis</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.include_call_to_action}
                onChange={(e) => setFormData({ ...formData, include_call_to_action: e.target.checked })}
                className="w-4 h-4 text-[#cf3232] border-gray-300 rounded focus:ring-[#cf3232]"
              />
              <span className="text-sm text-gray-700">Include Call-to-Action</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !formData.topic}
              className="flex items-center space-x-2 px-6 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Posts</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSocialPostModal;
