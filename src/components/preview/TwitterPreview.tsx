import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Heart, MessageCircle, Repeat2, Share, BarChart3 } from 'lucide-react';
import { ContentEditor } from './ContentEditorForPreview';
import Image from 'next/image';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

interface TwitterPostPageProps {
  article: Article;
  onBack: () => void;
}

const TwitterPostPage: React.FC<TwitterPostPageProps> = ({ article, onBack }) => {
  const [content, setContent] = useState<string>(`${article.content}\n\n${article.hashtags}`);

  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&ixlib=rb-4.0.3');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("Your Name");
  const [profileSubtitle, setProfileSubtitle] = useState<string>("yourusername");

  const displayImage: string | null = uploadedImage || imageUrl;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Outfit, sans-serif', color: '#333333' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Abolition Test, sans-serif', color: '#333333' }}>Magic Publishing</h1>
          </div>
          <button className="text-sm hover:opacity-80 font-medium" style={{ color: '#333333' }}>
            Edit Details
          </button>
        </div>
      </header>

      {/* Subtitle */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-[1800px] mx-auto">
          <p className="text-sm" style={{ color: '#333333' }}>Generate and manage your content across all platforms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-[1800px] mx-auto flex gap-2">
          <button className="px-4 py-3 bg-red-500 text-white rounded-t-lg font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Content
          </button>
          <button className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Books
          </button>
          <button className="px-4 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
            </svg>
            Podcasts
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80" style={{ color: '#333333' }}>
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Back to listing</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side - Reusable Editor */}
          <ContentEditor
            content={content}
            setContent={setContent}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            profileName={profileName}
            setProfileName={setProfileName}
            profileSubtitle={profileSubtitle}
            setProfileSubtitle={setProfileSubtitle}
            platformName="Twitter/X Post"
            showCharCount={true}
          />

          {/* Right Side - Twitter Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Abolition Test, sans-serif', color: '#333333' }}>Twitter/X Preview</h2>
              </div>
              
              <div className="p-6">
                {/* Twitter Post Card */}
                <div className="bg-white rounded-lg border border-gray-200 max-w-xl mx-auto">
                  <div className="p-4">
                    {/* Post Header */}
                    <div className="flex gap-3">
                      {/* Profile Picture */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-lg">
                        {profileName.charAt(0)}
                      </div>
                      
                      <div className="flex-1">
                        {/* User Info */}
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-bold text-gray-900 hover:underline cursor-pointer text-sm">
                              {profileName}
                            </span>
                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8.52 3.59c.8-1.36 2.96-1.36 3.76 0l1.45 2.49c.17.3.5.51.87.56l2.85.41c1.57.23 2.2 2.15 1.06 3.25l-2.06 2.01c-.24.23-.34.57-.29.9l.49 2.83c.27 1.55-1.37 2.74-2.78 2.01l-2.55-1.34c-.3-.16-.65-.16-.94 0l-2.55 1.34c-1.41.74-3.05-.46-2.78-2.01l.49-2.83c.05-.33-.05-.67-.29-.9l-2.06-2.01c-1.14-1.11-.51-3.02 1.06-3.25l2.85-.41c.37-.05.7-.26.87-.56l1.45-2.49z"/>
                            </svg>
                            <span className="text-gray-500 text-sm">@{profileSubtitle}</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-sm">2m</span>
                          </div>
                          <button className="text-gray-500 hover:bg-blue-50 hover:text-blue-500 p-1 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Tweet Content */}
                        <div className="mb-3">
                          <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                            {content}
                          </p>
                        </div>

                        {/* Tweet Image */}
                        {displayImage && (
                          <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200">
                            <Image
                              src={displayImage}
                              alt="Tweet content"
                              width={800}
                              height={600}
                              className="w-full h-auto"
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-6 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>24</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Repeat2 className="w-4 h-4" />
                            <span>142</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>1.2K</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>45.7K</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors group">
                            <MessageCircle className="w-5 h-5" />
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 hover:bg-green-50 px-3 py-2 rounded-full transition-colors group">
                            <Repeat2 className="w-5 h-5" />
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-full transition-colors group">
                            <Heart className="w-5 h-5" />
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors group">
                            <BarChart3 className="w-5 h-5" />
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-full transition-colors group">
                            <Share className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900 font-medium mb-1">Preview Mode</p>
                  <p className="text-xs text-blue-700">
                    This is how your post will appear on Twitter/X. The character limit for a tweet is 280 characters. Make changes on the left to see them reflected here in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPostPage;