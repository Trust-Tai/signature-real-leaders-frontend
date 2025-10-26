import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send, Globe } from 'lucide-react';
import { ContentEditor } from './ContentEditorForPreview';
import Image from 'next/image';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

interface LinkedInPostPageProps {
  article: Article;
  onBack: () => void;
}

const LinkedInPostPage: React.FC<LinkedInPostPageProps> = ({ article, onBack }) => {
  const [content, setContent] = useState<string>(`${article.content}\n\n${article.hashtags}`);

  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&ixlib=rb-4.0.3');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("Your Name");
  const [profileSubtitle, setProfileSubtitle] = useState<string>("Your Professional Title");

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
          <button className="px-4 py-3 hover:opacity-80 font-medium flex items-center gap-2" style={{ color: '#333333' }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Books
          </button>
          <button className="px-4 py-3 hover:opacity-80 font-medium flex items-center gap-2" style={{ color: '#333333' }}>
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
            platformName="LinkedIn Post"
            showCharCount={false}
          />

          {/* Right Side - LinkedIn Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Abolition Test, sans-serif', color: '#333333' }}>LinkedIn Preview</h2>
              </div>
              
              <div className="p-6">
                {/* LinkedIn Post Card */}
                <div className="bg-white rounded-lg border border-gray-300 shadow-sm max-w-xl mx-auto">
                  {/* Post Header */}
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* Profile Picture */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {profileName.charAt(0)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer hover:text-blue-700">
                              {profileName}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {profileSubtitle}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <span>2m</span>
                              <span>•</span>
                              <Globe className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:bg-blue-50 px-4 py-1 rounded-full font-semibold text-sm transition-colors">
                              + Follow
                            </button>
                            <button className="text-gray-600 hover:bg-gray-100 p-1 rounded-full">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {content}
                      </p>
                    </div>
                  </div>

                  {/* Post Image */}
                  {displayImage && (
                    <div className="w-full">
                      <Image
                        src={displayImage}
                        alt="Post content"
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
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border border-white">
                            <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white">
                            <span className="text-white text-[8px]">❤️</span>
                          </div>
                          <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border border-white">
                            <span className="text-white text-[8px]">💡</span>
                          </div>
                        </div>
                        <span className="ml-1 hover:text-blue-700 hover:underline cursor-pointer">1,234</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hover:text-blue-700 hover:underline cursor-pointer">56 comments</span>
                        <span className="hover:text-blue-700 hover:underline cursor-pointer">23 reposts</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-around">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-semibold text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Repeat2 className="w-5 h-5" />
                      <span className="font-semibold text-sm">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                      <Send className="w-5 h-5" />
                      <span className="font-semibold text-sm">Send</span>
                    </button>
                  </div>

                  {/* Comment Section */}
                  <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="border border-gray-400 rounded-full px-4 py-2 hover:border-gray-600 transition-colors cursor-text">
                          <span className="text-sm text-gray-600">Add a comment...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900 font-medium mb-1">Preview Mode</p>
                  <p className="text-xs text-blue-700">
                    This is how your post will appear on LinkedIn. Make changes on the left to see them reflected here in real-time. LinkedIn posts work best with professional content and relevant hashtags.
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

export default LinkedInPostPage;