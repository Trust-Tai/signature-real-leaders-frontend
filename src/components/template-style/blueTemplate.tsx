import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { images } from '@/assets';

interface BlueTemplateProps {
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

export default function BlueTemplate({
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
}: BlueTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="text-center mb-8">
          {/* Profile Image */}
          <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-gray-300 overflow-hidden border-4 border-purple-400/50 shadow-xl shadow-purple-500/30">
            <Image
              src={(profileData.profile_picture_url || profileData.profile_image) || images.userProfileImage}
              alt={`${profileData.full_name} Profile`}
              width={144}
              height={144}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = images.userProfileImage.src;
              }}
            />
          </div>

          {/* Name */}
          <h1 className="text-5xl font-bold text-white mb-3">
            {profileData.full_name}
          </h1>

          {/* Title */}
          {(profileData.occupation || profileData.company_name) && (
            <p className="text-purple-200 text-xl font-medium mb-6">
              {profileData.occupation && profileData.company_name
                ? `${profileData.occupation} at ${profileData.company_name}`
                : profileData.company_name || profileData.occupation
              }
            </p>
          )}

          {/* Audience Description */}
          {profileData.audience_description && (
            <p className="text-purple-300/90 text-base leading-relaxed max-w-md mx-auto">
              {profileData.audience_description}
            </p>
          )}
        </div>

        {/* Action Buttons - Dynamic Links */}
        <div className="space-y-4 mb-6">
          {profileData.links && profileData.links.length > 0 ? (
            profileData.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                className="w-full bg-purple-700/40 backdrop-blur-sm hover:bg-purple-700/60 text-white font-semibold text-lg py-5 px-6 rounded-2xl transition-all border border-purple-500/30 shadow-lg flex items-center justify-between"
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
            <div className="text-center text-purple-200/70 py-8">
              No links available
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="bg-purple-700/40 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-purple-500/30 shadow-lg">
          <div className="rounded-xl p-4 flex items-center justify-center h-28">
            <Image
              src={profileData.signature_url || images.profileSinature}
              alt={`${profileData.full_name} Signature`}
              width={300}
              height={100}
              className="max-w-full max-h-full object-contain"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.currentTarget.src = images.profileSinature.src;
              }}
            />
          </div>
        </div>

        {/* Newsletter Section - Only show if viewing someone else's profile */}
        {user && user.username !== profileData.username && (
          <div className="flex items-start mb-6 px-2">
            <input
              type="checkbox"
              id="newsletter-blue"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded mt-1 focus:ring-purple-500 flex-shrink-0"
            />
            <label htmlFor="newsletter-blue" className="text-purple-200/90 text-base ml-3 leading-relaxed cursor-pointer">
              Join {profileData.full_name}&apos;s Newsletter – Get insights and updates delivered to your inbox
            </label>
          </div>
        )}

        {/* Follow/Dashboard Button */}
        {user && user.username === profileData.username ? (
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl text-xl tracking-wide"
          >
            GO TO DASHBOARD
          </button>
        ) : (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl text-xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {followLoading ? 'LOADING...' : (isFollowing ? 'UNFOLLOW' : 'FOLLOW')}
          </button>
        )}
      </div>
    </div>
  );
}
