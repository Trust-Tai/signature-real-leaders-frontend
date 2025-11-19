import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { ContentEditor } from './ContentEditorForPreview';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

interface InstagramPostPageProps {
  article: Article;
  onBack: () => void;
}

const InstagramPostPage: React.FC<InstagramPostPageProps> = ({ article, onBack }) => {
  const [content, setContent] = useState<string>(`${article.content}\n\n${article.hashtags}`);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop&ixlib=rb-4.0.3');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("your_username");
  const [profileSubtitle, setProfileSubtitle] = useState<string>("Your Bio");

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
          {/* Left Side - Editor */}
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
            platformName="Instagram Post"
            showCharCount={false}
          />

          {/* Right Side - Instagram Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>Instagram Preview</h3>
            
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden max-w-md mx-auto">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {profileName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#333333' }}>{profileName}</p>
                  </div>
                </div>
                <button className="hover:opacity-70">
                  <MoreHorizontal className="w-5 h-5" style={{ color: '#333333' }} />
                </button>
              </div>

              {/* Post Image */}
              {displayImage && (
                <div className="relative w-full aspect-square bg-gray-100">
                  <img 
                    src={displayImage} 
                    alt="Instagram post" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="hover:opacity-70">
                      <Heart className="w-6 h-6" style={{ color: '#333333' }} />
                    </button>
                    <button className="hover:opacity-70">
                      <MessageCircle className="w-6 h-6" style={{ color: '#333333' }} />
                    </button>
                    <button className="hover:opacity-70">
                      <Send className="w-6 h-6" style={{ color: '#333333' }} />
                    </button>
                  </div>
                  <button className="hover:opacity-70">
                    <Bookmark className="w-6 h-6" style={{ color: '#333333' }} />
                  </button>
                </div>

                {/* Likes */}
                <p className="text-sm font-semibold" style={{ color: '#333333' }}>1,234 likes</p>

                {/* Caption */}
                <div className="text-sm">
                  <span className="font-semibold mr-2" style={{ color: '#333333' }}>{profileName}</span>
                  <span style={{ color: '#333333' }} className="whitespace-pre-wrap">
                    {content.split('\n').slice(0, 3).join('\n')}
                    {content.split('\n').length > 3 && '...'}
                  </span>
                  {content.split('\n').length > 3 && (
                    <button className="text-gray-500 ml-1">more</button>
                  )}
                </div>

                {/* Comments Preview */}
                <p className="text-sm text-gray-500">View all 42 comments</p>

                {/* Time */}
                <p className="text-xs text-gray-400 uppercase">2 hours ago</p>
              </div>

              {/* Add Comment */}
              <div className="border-t border-gray-200 p-3 flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 text-sm outline-none"
                  style={{ color: '#333333' }}
                />
                <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramPostPage;
