"use client";

import React, { useState } from 'react';
import { useUser } from '@/components/UserContext';
import { Copy, Check, Facebook, Twitter, Linkedin, Mail, MessageCircle, Share2, Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';

const ShareProfilePage = () => {
  const { user } = useUser();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Generate profile URL
  const profileUrl = user?.username
  ? `https://real-leaders.com/${user.username}`
  : '';

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate share URLs
  const shareText = user?.display_name ? `Check out ${user.display_name}'s profile on Real Leaders!` : 'Check out my profile on Real Leaders!';
  const encodedUrl = encodeURIComponent(profileUrl);
  const text = encodeURIComponent(shareText);
  
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    email: `mailto:?subject=${text}&body=${text}%20${encodedUrl}`
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center">
        <div className="text-[#101117]" style={{ fontFamily: 'Outfit, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="share-profile"
      />

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Share Your Profile
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Profile Preview Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            {user.profile_picture_url && (
              <img 
                src={user.profile_picture_url} 
                alt={user.display_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>{user.display_name}</h2>
              <p className="text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>@{user.username}</p>
            </div>
          </div>
          
          {/* Profile URL */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Your Profile URL</p>
              <p className="text-[#101117] truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{profileUrl}</p>
            </div>
            <button
              onClick={() => handleCopy(profileUrl, 'url')}
              className="ml-4 px-4 py-2 bg-[#CF3232] hover:bg-red-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {copiedField === 'url' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            </div>
            </div>

            {/* Social Media Share Buttons */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold text-[#101117] mb-4 flex items-center space-x-2" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
            <Share2 className="w-5 h-5" />
            <span>Share on Social Media</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Facebook */}
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
                <Facebook className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-[#101117] font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>Facebook</span>
            </a>

            {/* Twitter */}
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                <Twitter className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-[#101117] font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>Twitter</span>
            </a>

            {/* LinkedIn */}
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-[#101117] font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              href={shareUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-[#101117] font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href={shareUrls.email}
              className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-200"
            >
              <div className="w-10 h-10 bg-[#6B7280] rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#101117] font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>Email</span>
            </a>
            </div>
            </div>

            {/* Additional Share Options */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold text-[#101117] mb-4" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>Quick Copy Options</h3>
          
          <div className="space-y-3">
            {/* Copy Username */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>Username</p>
                <p className="text-[#101117]" style={{ fontFamily: 'Outfit, sans-serif' }}>@{user.username}</p>
              </div>
              <button
                onClick={() => handleCopy(user.username, 'username')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-[#101117] rounded-lg flex items-center space-x-2 transition-colors"
              >
                {copiedField === 'username' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Copy Display Name */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Outfit, sans-serif' }}>Display Name</p>
                <p className="text-[#101117]" style={{ fontFamily: 'Outfit, sans-serif' }}>{user.display_name}</p>
              </div>
              <button
                onClick={() => handleCopy(user.display_name, 'displayname')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-[#101117] rounded-lg flex items-center space-x-2 transition-colors"
              >
                {copiedField === 'displayname' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShareProfilePage;
