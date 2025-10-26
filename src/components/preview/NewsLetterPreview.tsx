import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ContentEditor } from './ContentEditorForPreview';
import Image from 'next/image';

interface Article {
  title: string;
  content: string;
  hashtags: string;
  meta_description: string;
}

interface NewsletterPageProps {
  article: Article;
  onBack: () => void;
}

const NewsletterPage: React.FC<NewsletterPageProps> = ({ article, onBack }) => {
  const [content, setContent] = React.useState<string>(article.content);

  const [imageUrl, setImageUrl] = React.useState<string>('https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&ixlib=rb-4.0.3');
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const [profileName, setProfileName] = React.useState<string>("Your Name");
  const [profileSubtitle, setProfileSubtitle] = React.useState<string>("Your Professional Title");

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
            platformName="Newsletter"
            showCharCount={false}
          />

          {/* Right Side - Newsletter Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Abolition Test, sans-serif', color: '#333333' }}>Newsletter Preview</h2>
              </div>
              
              <div className="p-8">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Abolition Test, sans-serif', color: '#333333' }}>
                    {article.title}
                  </h1>
                  <p className="text-sm mb-6" style={{ color: '#333333' }}>
                    {profileName}&apos;s Newsletter · Issue #42
                  </p>

                  {displayImage && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <Image
                        src={displayImage}
                        alt="Newsletter header"
                        width={800}
                        height={600}
                        className="w-full h-auto"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="prose prose-lg max-w-none">
                    {content.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 leading-relaxed whitespace-pre-wrap" style={{ color: '#333333' }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="mb-2" style={{ color: '#333333' }}>
                      What leadership principle has transformed your approach to business?
                    </p>
                    <p className="mb-6" style={{ color: '#333333' }}>- {profileName}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {article.hashtags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                        <span key={index} className="text-sm" style={{ color: '#333333' }}>{tag}</span>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm font-semibold mb-1" style={{ color: '#333333' }}>CTA</p>
                      <p className="text-sm" style={{ color: '#333333' }}>Book a demo · Learn more · Reply to this email</p>
                    </div>

                    <div className="text-sm" style={{ color: '#333333' }}>
                      <p className="mb-1">Best regards,</p>
                      <p className="font-semibold" style={{ color: '#333333' }}>{profileName}</p>
                      <p style={{ color: '#333333' }}>{profileSubtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;