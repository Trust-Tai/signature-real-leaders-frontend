import React, { useRef, ChangeEvent } from 'react';
import { ChevronLeft, Upload, Sparkles, Plus, Minus } from 'lucide-react';

// Types/Interfaces
interface ContentEditorProps {
  content: string;
  setContent: (content: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  profileSubtitle: string;
  setProfileSubtitle: (subtitle: string) => void;
  platformName?: string;
  showCharCount?: boolean;
}

// Reusable Left Side Editor Component
export const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content, 
  setContent, 
  imageUrl, 
  setImageUrl, 
  uploadedImage, // eslint-disable-line @typescript-eslint/no-unused-vars
  setUploadedImage,
  profileName,
  setProfileName,
  profileSubtitle,
  setProfileSubtitle,
  platformName = "Content",
  showCharCount = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setImageUrl(e.target.value);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
  };

  const wordCount: number = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount: number = content.length;
  const isOverLimit: boolean = showCharCount && charCount > 280;

  return (
    <div className="space-y-6">
      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{platformName} Content</h2>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded">
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
              {showCharCount ? `${charCount} / 280 characters` : `${wordCount} words`}
            </span>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <textarea
          value={content}
          onChange={handleContentChange}
          className={`w-full h-96 p-4 border rounded-lg font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 ${
            isOverLimit ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
          }`}
          placeholder="Write your content..."
        />
        {isOverLimit && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Tweet exceeds 280 character limit
          </p>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle / Headline
            </label>
            <input
              type="text"
              value={profileSubtitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProfileSubtitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <details className="group" open>
          <summary className="flex items-center gap-2 cursor-pointer list-none text-gray-700 font-medium">
            <span className="text-gray-400">▼</span>
            Add image (optional)
          </summary>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium">
                Generate Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </details>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Reset
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Enhance
          </button>
        </div>
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
          Save changes
        </button>
      </div>
    </div>
  );
};