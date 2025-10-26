'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';
import { useRouter, useParams } from "next/navigation";
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import { LoadingScreen } from '@/components';
import { useUser } from '@/components/UserContext';
import { recordProfileVisit, recordLinkClick } from '@/lib/statisticsApi';

interface ProfileData {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  description: string;
  company_name: string;
  company_website: string;
  industry: string;
  newsletter_service: string;
  occupation: string;
  location: string;
  profile_image: string;
  profile_picture_url: string;
  signature_url: string;
  links: Array<{
    id: number;
    name: string;
    url: string;
    display_name: string;
    icon: string;
  }>;
  primary_call_to_action: string;
  profile_template: {
    id: number;
    title: string;
    image_url: string;
    image_alt: string;
  };
  profile_privacy: string;
}

export default function DynamicUserProfile() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user } = useUser();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optIn, setOptIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [checkingFollowStatus, setCheckingFollowStatus] = useState(false);

  // Check follow status
  const checkFollowStatus = useCallback(async (userId: number) => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken || !user) return;

    try {
      setCheckingFollowStatus(true);
      const response = await api.checkFollowStatus(userId);
      if (response.success) {
        setIsFollowing(response.is_following);
      }
    } catch (err) {
      console.error('[Profile] Error checking follow status:', err);
    } finally {
      setCheckingFollowStatus(false);
    }
  }, [user]);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log('[Profile] Fetching profile for username:', username);
        const response = await api.getPublicProfile(username);
        console.log("response>>>>", response);
        
        if (response.success) {
          // Transform links to match the expected format
          const transformedProfile = {
            ...response.profile,
            links: response.profile.links?.map((link: {
              id?: number;
              key?: number;
              name?: string;
              label?: string;
              url?: string;
              display_name?: string;
              icon?: string;
            }) => ({
              id: link.id || link.key || 0,
              name: link.name || link.label || '',
              url: link.url || '',
              display_name: link.display_name || link.label || link.name || '',
              icon: link.icon || '🔗'
            })) || []
          };
          setProfileData(transformedProfile);
          
          // Record profile visit only if it's not the user's own profile
          const isOwnProfile = user && user.username === response.profile.username;
          if (!isOwnProfile) {
            try {
              const visitResponse = await recordProfileVisit(response.profile.user_id);
              console.log('[Profile] Visit recorded:', visitResponse);
            } catch (error) {
              console.error('[Profile] Error recording visit:', error);
              // Don't show error to user as this is background tracking
            }
          }
          
          // Check follow status if user is logged in and viewing someone else's profile
          if (user && response.profile.user_id !== user.id) {
            checkFollowStatus(response.profile.user_id);
          }
        } else {
          console.error('[Profile] API returned success: false');
          setError('Profile not found');
          toast.error('Profile not found');
        }
      } catch (err) {
        console.error('[Profile] Error fetching profile:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user, checkFollowStatus]);

  // Handle follow/unfollow button click
  const handleFollowToggle = async () => {
    if (!profileData || !user) return;

    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      toast.error('Please log in to follow users');
      return;
    }

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // Unfollow user
        const response = await api.unfollowUser(profileData.user_id);
        if (response.success) {
          setIsFollowing(false);
          toast.success(response.message);
        }
      } else {
        // Follow user
        const response = await api.followUser(profileData.user_id, optIn);
        if (response.success) {
          setIsFollowing(true);
          toast.success(response.message);
        }
      }
    } catch (err) {
      console.error('[Profile] Error toggling follow status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update follow status';
      toast.error(errorMessage);
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle go to dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  // Handle link click with tracking
  const handleLinkClick = async (link: { url: string; display_name: string; name: string }) => {
    console.log('[Profile] Link clicked:', link);
    
    // Record link click only if it's not the user's own profile
    if (profileData && user && user.username !== profileData.username) {
      try {
        const clickResponse = await recordLinkClick(profileData.user_id, link.url);
        console.log('[Profile] Link click recorded:', clickResponse);
      } catch (error) {
        console.error('[Profile] Error recording link click:', error);
        // Don't show error to user as this is background tracking
      }
    }
    
    // Open the link
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  // Handle company website click with tracking
  const handleCompanyWebsiteClick = async (websiteUrl: string) => {
    // Record link click only if it's not the user's own profile
    if (profileData && user && user.username !== profileData.username) {
      try {
        const clickResponse = await recordLinkClick(profileData.user_id, websiteUrl);
        console.log('[Profile] Company website click recorded:', clickResponse);
      } catch (error) {
        console.error('[Profile] Error recording company website click:', error);
      }
    }
    // Open the link
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle primary CTA click with tracking
  const handlePrimaryCTAClick = async (ctaText: string) => {
    // Record CTA click only if it's not the user's own profile
    if (profileData && user && user.username !== profileData.username) {
      try {
        const clickResponse = await recordLinkClick(profileData.user_id, ctaText);
        console.log('[Profile] Primary CTA click recorded:', clickResponse);
      } catch (error) {
        console.error('[Profile] Error recording primary CTA click:', error);
      }
    }
    
    // If it's a URL, open it
    if (ctaText.startsWith('http')) {
      window.open(ctaText, '_blank', 'noopener,noreferrer');
    }
  };

  // Loading state
  if (loading) {
    return <LoadingScreen text1="Loading profile..." text2={`Fetching data for @${username}`} />
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">
            The profile &quot;@{username}&quot; could not be found or is not available.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-cover bg-center bg-no-repeat ">
          <Image src={images.profileBgImage} alt='' className='w-full' style={{ height: "1440px" }} />
        </div>
        <div className="absolute inset-0  bg-black/92 h-[1440px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 pb-20 mt-[100px] lg:mt-[30]">
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
            {(profileData.profile_picture_url || profileData.profile_image) ? (
              <Image
                src={profileData.profile_picture_url || profileData.profile_image}
                alt={`${profileData.full_name} Profile`}
                width={180}
                height={180}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('[Profile] Image load error, using fallback');
                  e.currentTarget.src = images.userProfileImage.src;
                }}
              />
            ) : (
              <Image
                src={images.userProfileImage}
                alt={`${profileData.full_name} Profile`}
                width={180}
                height={180}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Name */}
          <h1
            className="text-white text-center font-outift font-medium w-full mb-4"
            style={{
              fontSize: '43px',
            }}
          >
            {profileData.full_name}
          </h1>

          {/* Company/Title */}
          {(profileData.occupation || profileData.company_name) && (
            <p
              className="text-white text-center w-full font-outift mb-2"
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
              className="text-white text-center w-full font-outift mb-2"
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
              className="text-white text-center w-full font-outift mb-2"
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
              className="text-white text-center w-full font-outift mb-4"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '16px',
                opacity: 0.8
              }}
            >
              🌐 <a
                href={profileData.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
                onClick={(e) => {
                  e.preventDefault();
                  handleCompanyWebsiteClick(profileData.company_website);
                }}
              >
                {profileData.company_website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}

          {/* Description */}
          {profileData.description && (
            <p
              className="text-center text-white px-4 py-2 rounded mb-8 mx-auto max-w-md"
              style={{
                fontFamily: 'Outfit',
                fontWeight: 400,
                fontSize: '15px',
              }}
            >
              {profileData.description}
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
              {profileData.newsletter_service && (
                <div className="mt-3 text-center">
                  <p className="text-white text-sm opacity-80">Newsletter Service</p>
                  <p className="text-white font-semibold capitalize">{profileData.newsletter_service}</p>
                </div>
              )}
            </div>
          </div>

          {/* Links Container */}
          <div className="w-full space-y-4 mb-8">
            {/* Primary Call to Action - Show first if exists */}
            {profileData.primary_call_to_action && (
              <button
                onClick={() => handlePrimaryCTAClick(profileData.primary_call_to_action)}
                className="w-full backdrop-blur-[20px] bg-red-600/80 rounded-lg flex items-center justify-between group px-4 hover:bg-red-600/90 transition-colors"
                style={{
                  height: '80px',
                  borderRadius: '10px',
                  opacity: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <span className="text-white text-left font-outfit" style={{ fontSize: 18, fontWeight: 600 }}>
                    {profileData.primary_call_to_action}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white group-hover:text-yellow-200 transition-colors" />
              </button>
            )}

            {/* Dynamic Links from API */}
            {profileData.links && profileData.links.length > 0 && profileData.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link)}
                className="w-full backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-between group px-4 hover:bg-white/30 transition-colors"
                style={{
                  height: '70px',
                  borderRadius: '10px',
                  opacity: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{link.icon || '🔗'}</span>
                  <div className="text-left">
                    <span className="text-white font-outfit block" style={{ fontSize: 18, fontWeight: 500 }}>
                      {link.display_name || link.name || 'Link'}
                    </span>
                    {link.url && (
                      <span className="text-white/70 font-outfit text-sm block">
                        {link.url.length > 30 ? link.url.substring(0, 30) + '...' : link.url}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            ))}

            {/* Show message if no links */}
            {(!profileData.links || profileData.links.length === 0) && !profileData.primary_call_to_action && (
              <div className="w-full backdrop-blur-[20px] bg-white/10 rounded-lg flex items-center justify-center px-4 py-8">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🔗</span>
                  <span className="text-white/70 font-outfit">No links available</span>
                </div>
              </div>
            )}

            {/* Signature Box */}
            <div
              className="w-full backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-center mb-8"
              style={{
                height: '126px',
                borderRadius: '10px',
                opacity: 1
              }}
            >
              {profileData.signature_url ? (
                <Image
                  src={profileData.signature_url}
                  alt={`${profileData.full_name} Signature`}
                  width={300}
                  height={100}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.log('[Profile] Signature image load error, using fallback');
                    e.currentTarget.src = images.profileSinature.src;
                  }}
                />
              ) : (
                <Image
                  src={images.profileSinature}
                  alt='Default Signature'
                  width={300}
                  height={100}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Newsletter Opt-in */}
            {user && profileData && user.username !== profileData.username && (
              <div className="flex items-start justify-center space-x-3 mb-6 px-4">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded mt-[5] focus:ring-red-500 flex-shrink-0"
                />
                <label
                  htmlFor="newsletter"
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
            {user && profileData && user.username === profileData.username ? (
              // Show "Go to Dashboard" if user is viewing their own profile
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
              // Show Follow/Unfollow button for other users
              <button
                onClick={handleFollowToggle}
                disabled={followLoading || checkingFollowStatus}
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
          </div>
        </div>
      </div>
    </div>
  );
}