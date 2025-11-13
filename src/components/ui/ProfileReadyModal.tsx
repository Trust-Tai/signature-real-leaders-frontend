'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles } from 'lucide-react';
import RedTemplate from '@/components/template-style/redTemplate';
import BlueTemplate from '@/components/template-style/blueTemplate';
import DefaultTemplate from '@/components/template-style/defaultTemplate';
import { 
  FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaLinkedin, FaFacebook, FaPodcast, FaBlog, FaHandshake, FaHeart, FaXTwitter
} from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';

interface ProfileReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    full_name?: string;
    username?: string;
    profile_picture_url?: string;
    profile_template?: { id?: number };
    [key: string]: unknown;
  } | null;
  user: { username?: string } | null;
}

export default function ProfileReadyModal({ isOpen, onClose, profileData, user }: ProfileReadyModalProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  const handleChangeTemplate = () => {
    onClose();
    // Navigate to template selection step in profile page (step 4)
    router.push('/dashboard/profile?step=4');
  };

  const templateId = profileData?.profile_template?.id;

  // Icon mapping function
  const getIconForLink = (linkName: string) => {
    const suggestedItems = [
      { label: 'Work With Me', icon: <FaHandshake style={{ color: '#1CA235' }} /> },
      { label: 'Donations', icon: <FaHeart style={{ color: '#e74c3c' }} /> },
      { label: 'Podcast', icon: <FaPodcast style={{ color: '#8e44ad' }} /> },
      { label: 'Instagram', icon: <FaInstagram style={{ color: '#E4405F' }} /> },
      { label: 'TikTok', icon: <FaTiktok style={{ color: '#000000' }} /> },
      { label: 'YouTube', icon: <FaYoutube style={{ color: '#FF0000' }} /> },
      { label: 'Spotify', icon: <FaSpotify style={{ color: '#1DB954' }} /> },
      { label: 'LinkedIn', icon: <FaLinkedin style={{ color: '#0077B5' }} /> },
      { label: 'Twitter/X', icon: <FaXTwitter style={{ color: '#000000' }} /> },
      { label: 'Facebook', icon: <FaFacebook style={{ color: '#1877F2' }} /> },
      { label: 'Blog', icon: <FaBlog style={{ color: '#FF6B35' }} /> },
      { label: 'Maps', icon: <FaMapMarkedAlt style={{ color: '#34A853' }} /> },
    ];

    const matchedItem = suggestedItems.find(item => 
      item.label.toLowerCase() === linkName.toLowerCase() ||
      linkName.toLowerCase().includes(item.label.toLowerCase()) ||
      item.label.toLowerCase().includes(linkName.toLowerCase())
    );

    return matchedItem ? matchedItem.icon : '🔗';
  };

  // Dummy functions for template preview (non-interactive)
  const dummyFunctions = {
    optIn: false,
    setOptIn: () => {},
    isFollowing: false,
    followLoading: false,
    handleFollowToggle: () => {},
    handleGoToDashboard: () => {},
    handleLinkClick: () => {},
    getIconForLink: getIconForLink,
    user: user
  };

  const renderTemplatePreview = () => {
    if (!profileData) {
      return (
        <div className="w-full p-8 text-center text-gray-500">
          No profile data available
        </div>
      );
    }

    const safeProfileData = {
      full_name: profileData.full_name || 'User',
      username: profileData.username || 'username',
      occupation: profileData.occupation as string | undefined,
      company_name: profileData.company_name as string | undefined,
      audience_description: profileData.audience_description as string | undefined,
      profile_picture_url: profileData.profile_picture_url,
      profile_image: profileData.profile_image as string | undefined,
      signature_url: profileData.signature_url as string | undefined,
      links: profileData.links as Array<{
        id: number;
        name: string;
        url: string;
        display_name: string;
        icon: string;
      }> | undefined,
      company_website: profileData.company_website as string | undefined,
      industry: profileData.industry as string | undefined,
      location: profileData.location as string | undefined,
      newsletter_service: profileData.newsletter_service as string | undefined,
    };

    if (templateId === 113) {
      // Red Template
      return (
        <div className="w-full pointer-events-none">
          <RedTemplate profileData={safeProfileData} {...dummyFunctions} />
        </div>
      );
    } else if (templateId === 117) {
      // Blue Template
      return (
        <div className="w-full pointer-events-none">
          <BlueTemplate profileData={safeProfileData} {...dummyFunctions} />
        </div>
      );
    } else {
      // Default Template (ID 119 or any other)
      return (
        <div className="w-full pointer-events-none">
          <DefaultTemplate profileData={safeProfileData} {...dummyFunctions} />
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[10000]">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 6)]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-white w-full h-full overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[10001] p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
        >
          <X className="w-7 h-7 text-gray-700" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-20 h-20 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-2xl md:text-3xl font-semibold">
              Your Public Profile is Ready!
            </p>
            <p className="text-lg md:text-xl mt-4 opacity-90">
              Scroll down to see your amazing profile ↓
            </p>
          </div>
        </div>

        {/* Profile Preview Section */}
        <div className="relative pb-48">
          {/* Template Preview - Full Width with bottom padding */}
          <div className="w-full mb-32">
            {renderTemplatePreview()}
          </div>

          {/* Floating Action Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-purple-600 shadow-2xl z-[10001] p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col  items-center gap-4">
                {/* Share Link Section */}
                <div className="flex-1 w-full">
                  <p className="text-sm text-gray-700 mb-2 font-semibold">
                    🎉 Share your profile:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/${profileData?.username || user?.username}`}
                      className="flex-1 px-4 py-3 bg-gray-50 text-[#333333] border-2 border-gray-300 rounded-lg text-sm font-mono"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/${profileData?.username || user?.username}`);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold whitespace-nowrap"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full lg:w-auto">
                  <button
                    onClick={handleChangeTemplate}
                    className="flex-1 lg:flex-none px-6 py-3 bg-white text-purple-600 font-bold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Change Template
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="flex-1 lg:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
