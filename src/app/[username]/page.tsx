'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useRouter, useParams } from "next/navigation";
import { api } from '@/lib/api';
import { addSubscriberToUser } from '@/lib/newsletterApi';
import { toast } from '@/components/ui/toast';
import { LoadingScreen } from '@/components';
import { useUser } from '@/components/UserContext';
import { recordProfileVisit, recordLinkClick } from '@/lib/statisticsApi';
import { 
  FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaLinkedin, FaFacebook, FaPodcast, FaBlog, FaHandshake, FaHeart, FaXTwitter
} from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';
import RedTemplate from '@/components/template-style/redTemplate';
import BlueTemplate from '@/components/template-style/blueTemplate';
import DefaultTemplate from '@/components/template-style/defaultTemplate';

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
  rss_feed_url: string;
  rss_feed_html: string;
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

// Icon mapping based on link names
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

  // Find matching icon based on link name (case insensitive)
  const matchedItem = suggestedItems.find(item => 
    item.label.toLowerCase() === linkName.toLowerCase() ||
    linkName.toLowerCase().includes(item.label.toLowerCase()) ||
    item.label.toLowerCase().includes(linkName.toLowerCase())
  );

  return matchedItem ? matchedItem.icon : '🔗';
};

export default function DynamicUserProfile() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  // Try to get user context, but don't fail if not available (public page)
  let user = null;
  try {
    const userContext = useUser();
    user = userContext.user;
  } catch (error) {
    // User context not available - this is fine for public pages
    user = null;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optIn, setOptIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Check follow status
  const checkFollowStatus = useCallback(async (userId: number) => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) return;

    try {
      const response = await api.checkFollowStatus(userId);
      if (response.success) {
        setIsFollowing(response.is_following);
      }
    } catch (err) {
      console.error('[Profile] Error checking follow status:', err);
    }
  }, []);

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
          const profile = response.profile as Record<string, unknown>;
          const transformedProfile = {
            ...response.profile,
            rss_feed_url: (profile.rss_feed_url as string) || '',
            rss_feed_html: (profile.rss_feed_html as string) || '',
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
          const authToken = localStorage.getItem('auth_token');
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
          if (authToken && (!user || response.profile.user_id !== user.id)) {
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
  }, [username, checkFollowStatus]);

  // Handle follow/unfollow button click
  const handleFollowToggle = async () => {
    // Check if user is logged in first
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      toast.error('You are not logged in');
      return;
    }

    if (!profileData) return;

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

  // Handle newsletter checkbox click
  const handleNewsletterCheckboxChange = async (checked: boolean) => {
    // Check if user is logged in first
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
      // Non-logged in user - show modal only when checking
      if (checked) {
        setShowNewsletterModal(true);
      }
      setOptIn(false); // Keep checkbox unchecked for non-logged users
      return;
    }

    // Logged in user - handle directly without popup
    if (checked) {
      // Subscribe to newsletter
      try {
        setNewsletterLoading(true);
        
        if (!profileData) {
          toast.error('Profile data not available');
          setOptIn(false);
          return;
        }
        
        // Get visitor's details from localStorage or user context
        const userDataStr = localStorage.getItem('user_data');
        let firstName = '';
        let lastName = '';
        let email = '';
        
        // Try to get data from user context first, then localStorage
        if (user) {
          firstName = user.first_name || '';
          lastName = user.last_name || '';
          email = user.email || '';
        }
        
        // Try to get more complete data from localStorage if available
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            firstName = userData.first_name || firstName;
            lastName = userData.last_name || lastName;
            email = userData.email || email;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        
        // Call the newsletter API using the helper function
        const response = await addSubscriberToUser(profileData.user_id, {
          email: email,
          first_name: firstName,
          last_name: lastName
        });
        
        if (response.success) {
          toast.success(response.message || 'Successfully subscribed to newsletter!');
          setOptIn(true);
        } else {
          toast.error(response.message || 'Failed to subscribe to newsletter');
          setOptIn(false);
        }
      } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to newsletter';
        toast.error(errorMessage);
        setOptIn(false);
      } finally {
        setNewsletterLoading(false);
      }
    } else {
      // Unchecking - just update state (no unsubscribe API for now)
      setOptIn(false);
    }
  };

  // Handle newsletter modal submit
  const handleNewsletterSubmit = async () => {
    if (!newsletterData.first_name || !newsletterData.last_name || !newsletterData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setNewsletterLoading(true);
      
      if (!profileData) {
        toast.error('Profile data not available');
        return;
      }
      
      // Call the newsletter API using the helper function
      const response = await addSubscriberToUser(profileData.user_id, {
        email: newsletterData.email,
        first_name: newsletterData.first_name,
        last_name: newsletterData.last_name
      });
      
      if (response.success) {
        toast.success(response.message || 'Successfully subscribed to newsletter!');
        setOptIn(true);
        setShowNewsletterModal(false);
        setNewsletterData({ first_name: '', last_name: '', email: '' });
      } else {
        toast.error(response.message || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to newsletter';
      toast.error(errorMessage);
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Handle link click with tracking
  const handleLinkClick = async (link: { url: string; display_name: string; name: string }) => {
    console.log('[Profile] Link clicked:', link);
    
    // Check if user is logged in and viewing their own profile
    const isOwnProfile = user && user.username === profileData?.username;
    
    // If user is viewing their own profile and account status is pending review
    if (isOwnProfile && user) {
      try {
        // Fetch current user details to check account status
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
          const userDetails = await api.getUserDetails(authToken);
          
          if (userDetails.success && userDetails.user.account_status === 'pending_review') {
            console.log('[Profile] User account is pending review, showing toast message');
            toast.info('Your account is pending review. Please wait for admin approval.', { autoClose: 4000 });
            return; // Don't open the link, stay on current page
          }
        }
      } catch (error) {
        console.error('[Profile] Error checking account status:', error);
        // Continue to open link if there's an error
      }
    }
    
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



  // Loading state
  if (loading) {
    return <LoadingScreen text1="Loading profile..." />
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

  // Check template ID and render accordingly
  const templateId = profileData.profile_template?.id;
  
  // Template ID 113 = Red Template
  if (templateId === 113) {
    return (
      <RedTemplate
        profileData={profileData}
        optIn={optIn}
        setOptIn={setOptIn}
        isFollowing={isFollowing}
        followLoading={followLoading}
        handleFollowToggle={handleFollowToggle}
        handleGoToDashboard={handleGoToDashboard}
        handleLinkClick={handleLinkClick}
        getIconForLink={getIconForLink}
        user={user}
        showNewsletterModal={showNewsletterModal}
        setShowNewsletterModal={setShowNewsletterModal}
        newsletterData={newsletterData}
        setNewsletterData={setNewsletterData}
        newsletterLoading={newsletterLoading}
        handleNewsletterSubmit={handleNewsletterSubmit}
        handleNewsletterCheckboxChange={handleNewsletterCheckboxChange}
      />
    );
  }

  // Template ID 117 = Blue Template
  if (templateId === 117) {
    return (
      <BlueTemplate
        profileData={profileData}
        optIn={optIn}
        setOptIn={setOptIn}
        isFollowing={isFollowing}
        followLoading={followLoading}
        handleFollowToggle={handleFollowToggle}
        handleGoToDashboard={handleGoToDashboard}
        handleLinkClick={handleLinkClick}
        getIconForLink={getIconForLink}
        user={user}
        showNewsletterModal={showNewsletterModal}
        setShowNewsletterModal={setShowNewsletterModal}
        newsletterData={newsletterData}
        setNewsletterData={setNewsletterData}
        newsletterLoading={newsletterLoading}
        handleNewsletterSubmit={handleNewsletterSubmit}
        handleNewsletterCheckboxChange={handleNewsletterCheckboxChange}
      />
    );
  }

  // Default template (ID 119 or no template)
  return (
    <DefaultTemplate
      profileData={profileData}
      optIn={optIn}
      setOptIn={setOptIn}
      isFollowing={isFollowing}
      followLoading={followLoading}
      handleFollowToggle={handleFollowToggle}
      handleGoToDashboard={handleGoToDashboard}
      handleLinkClick={handleLinkClick}
      getIconForLink={getIconForLink}
      user={user}
      showNewsletterModal={showNewsletterModal}
      setShowNewsletterModal={setShowNewsletterModal}
      newsletterData={newsletterData}
      setNewsletterData={setNewsletterData}
      newsletterLoading={newsletterLoading}
      handleNewsletterSubmit={handleNewsletterSubmit}
      handleNewsletterCheckboxChange={handleNewsletterCheckboxChange}
    />
  );
}
