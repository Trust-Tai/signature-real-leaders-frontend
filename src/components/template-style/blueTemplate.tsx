import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { images } from '@/assets';

interface BlueTemplateProps {
  profileData: {
    full_name: string;
    username: string;
    occupation?: string;
    company_name?: string;
    rss_feed_url?: string;
    rss_feed_html?: string;
    audience_description?: string;
    profile_picture_url?: string;
    profile_image?: string;
    signature_url?: string;
    newsletter_service?: string;
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
  showNewsletterModal?: boolean;
  setShowNewsletterModal?: (value: boolean) => void;
  newsletterData?: { first_name: string; last_name: string; email: string };
  setNewsletterData?: (value: { first_name: string; last_name: string; email: string }) => void;
  newsletterLoading?: boolean;
  handleNewsletterSubmit?: () => void;
  handleNewsletterCheckboxChange?: (checked: boolean) => void;
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
  user,
  showNewsletterModal,
  setShowNewsletterModal,
  newsletterData,
  setNewsletterData,
  newsletterLoading,
  handleNewsletterSubmit,
  handleNewsletterCheckboxChange
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

        {/* RSS Feed Button - if RSS URL exists */}
        {profileData.rss_feed_url && (
          <a
            href={profileData.rss_feed_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-orange-500/30 to-orange-600/30 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-orange-400/40 hover:from-orange-500/40 hover:to-orange-600/40 transition-all group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                    <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">RSS Feed</p>
                  <p className="text-orange-200 text-sm">Subscribe to my content</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-300 group-hover:text-white transition-colors" />
            </div>
          </a>
        )}

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

        {/* Newsletter Section - Show only if newsletter_service is configured and user is viewing someone else's profile */}
        {profileData.newsletter_service && profileData.newsletter_service.trim() !== '' && (!user || user.username !== profileData.username) && (
          <div className="flex items-start mb-6 px-2">
            {newsletterLoading ? (
              <div className="w-5 h-5 mt-1 flex-shrink-0">
                <div className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <input
                type="checkbox"
                id="newsletter-blue"
                checked={optIn}
                onChange={(e) => handleNewsletterCheckboxChange ? handleNewsletterCheckboxChange(e.target.checked) : setOptIn(e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded mt-1 focus:ring-purple-500 flex-shrink-0 cursor-pointer"
              />
            )}
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

        {/* Claim Your Link CTA */}
        <div className="w-full text-center mt-4">
          <Link
            href="/profile-verification"
            className="text-white hover:text-white/90 font-semibold text-lg transition-colors decoration-blue-400 underline underline-offset-4"
          >
            Claim your link
          </Link>
        </div>

        {/* Real Leaders Impact Awards Logo */}
        <div className="w-full flex items-center justify-center mt-6">
          <Image
            src={images.realLeadersWhite}
            alt="Real Leaders Impact Awards"
            width={200}
            height={60}
            className="object-contain opacity-80"
          />
        </div>
      </div>

      {/* Newsletter Modal for Non-Logged-In Users */}
      {showNewsletterModal && setShowNewsletterModal && newsletterData && setNewsletterData && handleNewsletterSubmit && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewsletterModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Subscribe to Newsletter</h2>
              <button
                onClick={() => setShowNewsletterModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Join {profileData.full_name}&apos;s newsletter to receive insights and updates.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={newsletterData.first_name}
                  onChange={(e) => setNewsletterData({ ...newsletterData, first_name: e.target.value })}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={newsletterData.last_name}
                  onChange={(e) => setNewsletterData({ ...newsletterData, last_name: e.target.value })}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newsletterData.email}
                  onChange={(e) => setNewsletterData({ ...newsletterData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewsletterModal(false)}
                disabled={newsletterLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNewsletterSubmit}
                disabled={newsletterLoading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
