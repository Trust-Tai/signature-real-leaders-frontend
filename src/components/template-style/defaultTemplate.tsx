import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { images } from '@/assets';

interface DefaultTemplateProps {
  profileData: {
    full_name: string;
    username: string;
    occupation?: string;
    company_name?: string;
    company_website?: string;
    rss_feed_url?: string;
    rss_feed_html?: string;
    industry?: string;
    location?: string;
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

export default function DefaultTemplate({
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
}: DefaultTemplateProps) {
  return (
    <>
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .link-button:active {
          animation: pulse 0.2s ease-in-out;
        }
      `}</style>
      <div className="min-h-screen text-white relative overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat">
          <Image src={images.profileBgImage} alt='' className='w-full' style={{ height: "1440px" }} />
        </div>
        <div className="absolute inset-0 bg-black/92 h-[1440px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 pb-20 mt-[100px] lg:mt-[30px]">
        <div
          className="relative mx-auto"
          style={{
            width: '504px',
            maxWidth: '90vw',
            minHeight: '1250px',
            marginTop: '25px',
            opacity: 1
          }}
        >
          {/* Profile Image */}
          <div
            className="relative mx-auto bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center border border-white overflow-hidden mb-8"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '200px',
              borderWidth: '1px',
              opacity: 1
            }}
          >
            <Image
              src={(profileData.profile_picture_url || profileData.profile_image) || images.userProfileImage}
              alt={`${profileData.full_name} Profile`}
              width={180}
              height={180}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = images.userProfileImage.src;
              }}
            />
          </div>

          {/* Name */}
          <h1
            className="text-white text-center font-outfit font-medium w-full mb-4"
            style={{
              fontSize: '43px',
            }}
          >
            {profileData.full_name}
          </h1>

          {/* Company/Title */}
          {(profileData.occupation || profileData.company_name) && (
            <p
              className="text-white text-center w-full font-outfit mb-2"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '18px',
              }}
            >
              {profileData.occupation && profileData.company_name
                ? `${profileData.occupation} at ${profileData.company_name}`
                : profileData.company_name || profileData.occupation
              }
            </p>
          )}

          {/* Industry */}
          {profileData.industry && (
            <p
              className="text-white text-center w-full font-outfit mb-2"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '16px',
                opacity: 0.9
              }}
            >
              {profileData.industry}
            </p>
          )}

          {/* Location */}
          {profileData.location && (
            <p
              className="text-white text-center w-full font-outfit mb-2"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '16px',
                opacity: 0.8
              }}
            >
              📍 {profileData.location}
            </p>
          )}

          {/* Company Website */}
          {profileData.company_website && (
            <p
              className="text-white text-center w-full font-outfit mb-4"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '16px',
                opacity: 0.8
              }}
            >
              🌐 {profileData.company_website.replace(/^https?:\/\//, '')}
            </p>
          )}

          {/* Audience Description */}
          {profileData.audience_description && (
            <p
              className="text-center text-white px-4 py-2 rounded mb-8 mx-auto max-w-md"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '15px',
              }}
            >
              {profileData.audience_description}
            </p>
          )}

          {/* Profile Stats */}
          <div className="w-full mb-6 px-4">
            <div className="backdrop-blur-[20px] bg-white/10 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-white text-sm opacity-80">Username</p>
                  <p className="text-white font-semibold">@{profileData.username}</p>
                </div>
                <div>
                  <p className="text-white text-sm opacity-80">Links</p>
                  <p className="text-white font-semibold">{profileData.links?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Container */}
          <div className="w-full space-y-4 mb-8">
            {/* Dynamic Links from API */}
            {profileData.links && profileData.links.length > 0 ? (
              profileData.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link)}
                  className="w-full backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-between group px-4 hover:bg-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-white/10 active:shadow-inner"
                  style={{
                    height: '80px',
                    borderRadius: '10px',
                    opacity: 1
                  }}
                  onMouseDown={(e) => {
                    // Add ripple effect
                    const button = e.currentTarget;
                    const rect = button.getBoundingClientRect();
                    const ripple = document.createElement('span');
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                      position: absolute;
                      width: ${size}px;
                      height: ${size}px;
                      left: ${x}px;
                      top: ${y}px;
                      background: rgba(255, 255, 255, 0.3);
                      border-radius: 50%;
                      transform: scale(0);
                      animation: ripple 0.6s linear;
                      pointer-events: none;
                      z-index: 1;
                    `;
                    
                    button.style.position = 'relative';
                    button.style.overflow = 'hidden';
                    button.appendChild(ripple);
                    
                    setTimeout(() => {
                      ripple.remove();
                    }, 600);
                  }}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <div className="text-2xl flex items-center justify-center w-8 h-8 transform group-hover:scale-110 transition-transform duration-200">
                      {getIconForLink(link.name)}
                    </div>
                    <div className="text-left">
                      <span className="text-white font-outfit block group-hover:text-white/90 transition-colors duration-200" style={{ fontSize: 18, fontWeight: 500 }}>
                        {link.display_name || link.name || 'Link'}
                      </span>
                      {link.url && (
                        <span className="text-white/70 font-outfit text-sm block group-hover:text-white/80 transition-colors duration-200">
                          {link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 relative z-10" />
                </button>
              ))
            ) : (
              <div className="w-full backdrop-blur-[20px] bg-white/10 rounded-lg flex items-center justify-center px-4 py-8">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🔗</span>
                  <span className="text-white/70 font-outfit">No links available</span>
                </div>
              </div>
            )}

            {/* RSS Feed Button - if RSS URL exists */}
            {profileData.rss_feed_url && (
              <a
                href={profileData.rss_feed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full backdrop-blur-[20px] bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-lg flex items-center justify-between group px-4 hover:from-orange-500/40 hover:to-orange-600/40 transition-all border border-orange-400/30"
                style={{
                  height: '70px',
                  borderRadius: '10px',
                  opacity: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex items-center justify-center w-8 h-8">
                    <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                      <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-white font-outfit block" style={{ fontSize: 18, fontWeight: 500 }}>
                      RSS Feed
                    </span>
                    <span className="text-orange-200 font-outfit text-sm block">
                      Subscribe to my content
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-300 group-hover:text-white transition-colors" />
              </a>
            )}

            {/* Signature Box */}
            <div
              className="w-full profilesignimagediv backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-center mb-4"
              style={{
                height: '126px',
                borderRadius: '10px',
                opacity: 1,
              }}
            >
              <Image
                src={profileData.signature_url || images.profileSinature}
                alt={`${profileData.full_name} Signature`}
                width={300}
                height={100}
                className="w-full max-h-full signimage object-contain"
                style={{ mixBlendMode: 'multiply', filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  e.currentTarget.src = images.profileSinature.src;
                }}
              />
            </div>

            {/* Newsletter Opt-in - Always show when user is viewing someone else's profile */}
            {(!user || user.username !== profileData.username) && (
              <div className="flex items-start justify-center space-x-3 mb-4 px-4">
                {newsletterLoading ? (
                  <div className="w-4 h-4 mt-[5px] flex-shrink-0">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    id="newsletter-default"
                    checked={optIn}
                    onChange={(e) => handleNewsletterCheckboxChange ? handleNewsletterCheckboxChange(e.target.checked) : setOptIn(e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded mt-[5px] focus:ring-red-500 flex-shrink-0 cursor-pointer"
                  />
                )}
                <label
                  htmlFor="newsletter-default"
                  className="text-start cursor-pointer"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22.2px',
                    letterSpacing: '1%',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  Join {profileData.full_name}&apos;s Newsletter - Get insights and updates delivered to your inbox
                </label>
              </div>
            )}



            {/* Follow/Dashboard Button */}
            {user && user.username === profileData.username ? (
              <button
                onClick={handleGoToDashboard}
                className="w-full transition-colors duration-200 text-white rounded-lg mb-4 bg-[#CF3232] hover:bg-red-600 cursor-pointer"
                style={{
                  height: '60px',
                  fontSize: "25px",
                  fontFamily: "Abolition Test"
                }}
              >
                GO TO DASHBOARD
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className="w-full transition-colors duration-200 text-white rounded-lg mb-4 bg-[#CF3232] hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  height: '60px',
                  fontSize: "25px",
                  fontFamily: "Abolition Test"
                }}
              >
                {followLoading ? 'LOADING...' : (isFollowing ? 'UNFOLLOW' : 'FOLLOW')}
              </button>
            )}

            {/* Claim Your Link CTA */}
            <div className="w-full text-center mb-6">
              <Link
                href="/profile-verification"
                className="text-white hover:text-white/90 font-outfit text-lg transition-colors decoration-blue-400 underline underline-offset-4"
              >
                Claim your link
              </Link>
            </div>

            {/* Real Leaders Impact Awards Logo */}
            <div className="w-full flex items-center justify-center mb-8">
              <Image
                src={images.realLeadersWhite}
                alt="Real Leaders Impact Awards"
                width={200}
                height={60}
                className="object-contain opacity-80"
              />
            </div>
          </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800"
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
                className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}
