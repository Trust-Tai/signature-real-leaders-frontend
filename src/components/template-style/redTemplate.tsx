import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { images } from '@/assets';

interface RedTemplateProps {
  profileData: {
    full_name: string;
    username: string;
    occupation?: string;
    company_name?: string;
    audience_description?: string;
    profile_picture_url?: string;
    profile_image?: string;
    signature_url?: string;
    links?: Array<{
      id: number;
      name: string;
      url: string;
      display_name: string;
      icon: string;
    }>;
  };
  optIn: boolean;
  setOptIn: (value: boolean) => void;
  isFollowing: boolean;
  followLoading: boolean;
  handleFollowToggle: () => void;
  handleGoToDashboard: () => void;
  handleLinkClick: (link: { url: string; display_name: string; name: string }) => void;
  getIconForLink: (linkName: string) => React.ReactNode;
  user: { username?: string } | null;
}

export default function RedTemplate({
  profileData,
  optIn,
  setOptIn,
  isFollowing,
  followLoading,
  handleFollowToggle,
  handleGoToDashboard,
  handleLinkClick,
  getIconForLink,
  user
}: RedTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="text-center mb-8">
          {/* Profile Image */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-300 overflow-hidden border-4 border-white/30">
            <Image
              src={(profileData.profile_picture_url || profileData.profile_image) || images.userProfileImage}
              alt={`${profileData.full_name} Profile`}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = images.userProfileImage.src;
              }}
            />
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold text-white mb-2">
            {profileData.full_name}
          </h1>

          {/* Title */}
          {(profileData.occupation || profileData.company_name) && (
            <p className="text-white/90 text-lg font-medium mb-4">
              {profileData.occupation && profileData.company_name
                ? `${profileData.occupation} at ${profileData.company_name}`
                : profileData.company_name || profileData.occupation
              }
            </p>
          )}

          {/* Audience Description */}
          {profileData.audience_description && (
            <p className="text-white/80 text-sm leading-relaxed max-w-sm mx-auto">
              {profileData.audience_description}
            </p>
          )}
        </div>

        {/* Action Buttons - Dynamic Links */}
        <div className="space-y-3 mb-6">
          {profileData.links && profileData.links.length > 0 ? (
            profileData.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-4 px-6 rounded-xl transition-all border border-white/30 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex items-center justify-center w-8 h-8">
                    {getIconForLink(link.name)}
                  </div>
                  <span>{link.display_name || link.name}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            ))
          ) : (
            <div className="text-center text-white/70 py-8">
              No links available
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/30">
          <div className="rounded-lg p-4 h-24 flex items-center justify-center">
            <Image
              src={profileData.signature_url || images.profileSinature}
              alt={`${profileData.full_name} Signature`}
              width={200}
              height={60}
              className="max-w-full max-h-full object-contain"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.currentTarget.src = images.profileSinature.src;
              }}
            />
          </div>
        </div>

        {/* Newsletter Text - Only show if viewing someone else's profile */}
        {user && user.username !== profileData.username && (
          <div className="flex items-start justify-center space-x-3 mb-4 px-2">
            <input
              type="checkbox"
              id="newsletter-red"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded mt-1 focus:ring-red-500 flex-shrink-0"
            />
            <label htmlFor="newsletter-red" className="text-white/90 text-sm cursor-pointer text-left">
              Join {profileData.full_name}&apos;s Newsletter – Get insights and updates delivered to your inbox
            </label>
          </div>
        )}

        {/* Follow/Dashboard Button */}
        {user && user.username === profileData.username ? (
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-lg"
          >
            GO TO DASHBOARD
          </button>
        ) : (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {followLoading ? 'LOADING...' : (isFollowing ? 'UNFOLLOW' : 'FOLLOW')}
          </button>
        )}
      </div>
    </div>
  );
}