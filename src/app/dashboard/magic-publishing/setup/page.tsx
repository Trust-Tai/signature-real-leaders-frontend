"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Users, Info, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { UserProfileSidebar, useUser } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from "@/components/ui/dashboardFooter"
import { useRouter } from 'next/navigation';
import { countries } from '@/default/countries';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';
import { 
  FaHandshake, 
  FaHeart, 
  FaPodcast, 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaSpotify, 
  FaLinkedin, 
  FaXTwitter, 
  FaFacebook, 
  FaBlog
} from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';
const MagicPublishingSetup = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading: userLoading, error: userError } = useUser();
  
  // State for profile update
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // Form data state - initialize with empty values or get from localStorage/API
  const [formData, setFormData] = useState({
    billing_city: '',
    billing_postcode: '',
    billing_country: '',
    targetAudience: [
      { role: '', ageRange: '', demographics: '' }
    ],
    topPainPoints: '',
    brandVoice: '',
    uniqueDifferentiation: '',
    primaryCallToAction: '',
    contentPreferenceIndustries: [] as string[],
    companySocialProfiles: [{ platform: 'Website', url: '' }]
  });

  const [customIndustry, setCustomIndustry] = useState('');
  const [customLinkLabel, setCustomLinkLabel] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');

  // Note: Removed localStorage loading to prioritize API data
  // TODO: Add localStorage fallback after API data loading is confirmed working

  // Populate form with user data when user is loaded
  useEffect(() => {
    if (user) {
      const mappedAudience = user.target_audience && user.target_audience.length > 0 
        ? user.target_audience.map(audience => ({
            role: audience.name || '',
            ageRange: audience.age_group || '',
            demographics: audience.demographic_details || ''
          }))
        : [{ role: '', ageRange: '', demographics: '' }];
      
      setFormData(prev => ({
        ...prev,
        // Map user data to form fields
        billing_city: user.billing_city || '',
        billing_postcode: user.billing_postcode || '',
        billing_country: user.billing_country || '',
        targetAudience: mappedAudience,
        topPainPoints: user.top_pain_points || '',
        brandVoice: user.brand_voice || '',
        uniqueDifferentiation: user.unique_differentiation || '',
        primaryCallToAction: user.primary_call_to_action || '',
        contentPreferenceIndustries: user.content_preference_industry || [],
        companySocialProfiles: user.links && user.links.length > 0 
          ? user.links.map(link => ({ platform: link.name, url: link.url }))
          : [{ platform: 'Website', url: user.company_website || '' }]
      }));
    }
  }, [user]);

  const industries = [
    'Technology', 'Education', 'Nonprofit', 'Media & Entertainment',
    'Healthcare', 'Retail', 'Real Estate', 'Energy',
    'Finance', 'Manufacturing', 'Hospitality', 'Government'
  ];

  const ageGroups = [
    '18-24',
    '25-34', 
    '35-44',
    '45-54',
    '55-64',
    '65+'
  ];
  


  const suggestedItems: { label: string; icon: React.ReactNode; placeholder?: string }[] = [
    { label: 'Work With Me', icon: <FaHandshake style={{ color: '#1CA235' }} />, placeholder: 'https://your-website.com/work-with-me' },
    { label: 'Donations', icon: <FaHeart style={{ color: '#e74c3c' }} />, placeholder: 'https://donate.example.com/your-handle' },
    { label: 'Podcast', icon: <FaPodcast style={{ color: '#8e44ad' }} />, placeholder: 'https://podcasts.apple.com/...' },
    { label: 'Instagram', icon: <FaInstagram style={{ color: '#E4405F' }} />, placeholder: 'https://instagram.com/yourhandle' },
    { label: 'TikTok', icon: <FaTiktok style={{ color: '#000000' }} />, placeholder: 'https://tiktok.com/@yourhandle' },
    { label: 'YouTube', icon: <FaYoutube style={{ color: '#FF0000' }} />, placeholder: 'https://youtube.com/@yourchannel' },
    { label: 'Spotify', icon: <FaSpotify style={{ color: '#1DB954' }} />, placeholder: 'https://open.spotify.com/show/...' },
    { label: 'LinkedIn', icon: <FaLinkedin style={{ color: '#0077B5' }} />, placeholder: 'https://linkedin.com/in/yourhandle' },
    { label: 'Twitter/X', icon: <FaXTwitter style={{ color: '#000000' }} />, placeholder: 'https://x.com/yourhandle' },
    { label: 'Facebook', icon: <FaFacebook style={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/yourpage' },
    { label: 'Blog', icon: <FaBlog style={{ color: '#FF6B35' }} />, placeholder: 'https://your-website.com/blog' },
    { label: 'Maps', icon: <FaMapMarkedAlt style={{ color: '#34A853' }} />, placeholder: 'https://maps.app.goo.gl/...' },
  ];



  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAudienceRow = () => {
    setFormData(prev => ({
      ...prev,
      targetAudience: [...prev.targetAudience, { role: '', ageRange: '', demographics: '' }]
    }));
  };

  const removeAudienceRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }));
  };

  const updateAudienceRow = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleIndustry = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      contentPreferenceIndustries: prev.contentPreferenceIndustries.includes(industry)
        ? prev.contentPreferenceIndustries.filter(i => i !== industry)
        : [...prev.contentPreferenceIndustries, industry]
    }));
  };

  const addCustomIndustry = () => {
    if (customIndustry.trim() && !formData.contentPreferenceIndustries.includes(customIndustry.trim())) {
      setFormData(prev => ({
        ...prev,
        contentPreferenceIndustries: [...prev.contentPreferenceIndustries, customIndustry.trim()]
      }));
      setCustomIndustry('');
    }
  };

  const removeSocialProfile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companySocialProfiles: prev.companySocialProfiles.filter((_, i) => i !== index)
    }));
  };

  const addSuggestedItem = (item: { label: string; icon: React.ReactNode; placeholder?: string }) => {
    setFormData(prev => ({
      ...prev,
      companySocialProfiles: [...prev.companySocialProfiles, { platform: item.label, url: '' }]
    }));
  };

  const addCustomLink = () => {
    if (customLinkLabel.trim() && customLinkUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        companySocialProfiles: [...prev.companySocialProfiles, { platform: customLinkLabel.trim(), url: customLinkUrl.trim() }]
      }));
      setCustomLinkLabel('');
      setCustomLinkUrl('');
    }
  };

  const updateSocialProfile = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      companySocialProfiles: prev.companySocialProfiles.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsUpdatingUser(true);
      
      // Update user profile with form data
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('[Setup] Updating user profile...');

      // Prepare user update payload
      const userUpdatePayload = {
        billing_city: formData.billing_city,
        billing_postcode: formData.billing_postcode,
        billing_country: formData.billing_country,
        target_audience: formData.targetAudience.map(audience => ({
          name: audience.role || '',
          age_group: audience.ageRange || '',
          demographic_details: audience.demographics || ''
        })),
        top_pain_points: formData.topPainPoints,
        brand_voice: formData.brandVoice,
        unique_differentiation: formData.uniqueDifferentiation,
        primary_call_to_action: formData.primaryCallToAction,
        content_preference_industry: formData.contentPreferenceIndustries,
        links: formData.companySocialProfiles
          .filter(profile => profile.url.trim())
          .map(profile => ({ name: profile.platform, url: profile.url.trim() }))
      };

      // Update user profile
      console.log('[Setup] Updating user profile with payload:', userUpdatePayload);
      const updateResponse = await api.updateProfile(token, userUpdatePayload);
      
      if (!updateResponse.success) {
        throw new Error('Failed to update user profile');
      }

      console.log('[Setup] Profile updated successfully!');
      toast.success('Profile updated successfully!', { autoClose: 3000 });
      setIsUpdatingUser(false);

      // Navigate back to Magic Publishing main page
      setTimeout(() => {
        router.push('/dashboard/magic-publishing');
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to update profile: ${errorMessage}`);
      setIsUpdatingUser(false);
    }
  };



  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile data...</p>
        </div>
      </div>
    );
  }

  // Show error state if user data failed to load
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Info className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{userError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-setup"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Magic Publishing Setup
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
              </div>
              
              {/* Notifications and Profile Icons */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span> */}
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span> */}
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="sm:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search here..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
                style={{ color: '#949494' }}
              />
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
           

            {/* Setup Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#101117] mb-6">Tell us about you</h3>
              
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        value={formData.billing_city}
                        onChange={(e) => handleInputChange('billing_city', e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.billing_postcode}
                        onChange={(e) => handleInputChange('billing_postcode', e.target.value)}
                        placeholder="Postcode/ZIP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                    </div>
                    <div>
                      <select
                        value={formData.billing_country}
                        onChange={(e) => handleInputChange('billing_country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <p className="text-sm text-gray-600 mb-4">List the people/roles, age range, and demographic segments you target.</p>
                  
                  {formData.targetAudience.map((audience, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            value={audience.role}
                            onChange={(e) => updateAudienceRow(index, 'role', e.target.value)}
                            placeholder="People / Role (e.g., Startup founders)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            style={{ color: '#333333' }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={audience.ageRange}
                            onChange={(e) => updateAudienceRow(index, 'ageRange', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            style={{ color: '#333333' }}
                          >
                            <option value="">Select age group</option>
                            {ageGroups.map((ageGroup) => (
                              <option key={ageGroup} value={ageGroup}>
                                {ageGroup}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeAudienceRow(index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={audience.demographics}
                          onChange={(e) => updateAudienceRow(index, 'demographics', e.target.value)}
                          placeholder="Demographic details (e.g., location, income band, interests)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          style={{ color: '#333333' }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addAudienceRow}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add audience row</span>
                  </button>
                </div>

                {/* Top Pain Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Top Pain Points</label>
                  <p className="text-sm text-gray-600 mb-4">List 3-5 pains your audience feels</p>
                  <textarea
                    value={formData.topPainPoints}
                    onChange={(e) => handleInputChange('topPainPoints', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter pain points..."
                    style={{ color: '#333333' }}
                  />
                </div>

                {/* Brand Voice and Unique Differentiation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Voice</label>
                    <input
                      type="text"
                      value={formData.brandVoice}
                      onChange={(e) => handleInputChange('brandVoice', e.target.value)}
                      placeholder="e.g., Bold, data-driven, friendly"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      style={{ color: '#333333' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unique Differentiation</label>
                    <input
                      type="text"
                      value={formData.uniqueDifferentiation}
                      onChange={(e) => handleInputChange('uniqueDifferentiation', e.target.value)}
                      placeholder="Why choose you vs others?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      style={{ color: '#333333' }}
                    />
                  </div>
                </div>

                {/* Primary Call-to-Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Call-to-Action</label>
                  <input
                    type="text"
                    value={formData.primaryCallToAction}
                    onChange={(e) => handleInputChange('primaryCallToAction', e.target.value)}
                    placeholder="e.g., Book a demo, Join the newsletter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    style={{ color: '#333333' }}
                  />
                </div>

                {/* Content Preference Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Preference Industry</label>
                  <p className="text-sm text-gray-600 mb-4">Select one or more industries, or add your own unique ones.</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {industries.map((industry) => (
                      <label key={industry} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.contentPreferenceIndustries.includes(industry)}
                          onChange={() => toggleIndustry(industry)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="Add a unique industry (e.g., Web3, Agritech, Beauty & Wellness)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      style={{ color: '#333333' }}
                    />
                    <button
                      onClick={addCustomIndustry}
                      className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Company Social Profiles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Social Profiles</label>
                  <p className="text-sm text-gray-600 mb-4">Add separate links by selecting a platform and pasting its URL.</p>
                  
                  {formData.companySocialProfiles.map((profile, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-4">
                      <input
                        type="text"
                        value={profile.platform}
                        onChange={(e) => updateSocialProfile(index, 'platform', e.target.value)}
                        placeholder="Platform Name"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                      <input
                        type="url"
                        value={profile.url}
                        onChange={(e) => updateSocialProfile(index, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                      <button
                        onClick={() => removeSocialProfile(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Suggested Items */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Add Popular Links</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {suggestedItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => addSuggestedItem(item)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ color: '#333333' }}
                        >
                          {item.icon}
                          <span className="truncate" style={{ color: '#333333' }}>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Link Input */}
                  <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Link</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={customLinkLabel}
                        onChange={(e) => setCustomLinkLabel(e.target.value)}
                        placeholder="Link Label (e.g., Portfolio)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                      <input
                        type="url"
                        value={customLinkUrl}
                        onChange={(e) => setCustomLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ color: '#333333' }}
                      />
                      <button
                        onClick={addCustomLink}
                        disabled={!customLinkLabel.trim() || !customLinkUrl.trim()}
                        className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-6 mt-8 border-t border-gray-200">

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const defaultData = {
                        billing_city: '',
                        billing_postcode: '',
                        billing_country: '',
                        targetAudience: [{ role: '', ageRange: '', demographics: '' }],
                        topPainPoints: '',
                        brandVoice: '',
                        uniqueDifferentiation: '',
                        primaryCallToAction: '',
                        contentPreferenceIndustries: [] as string[],
                        companySocialProfiles: [{ platform: 'Website', url: '' }]
                      };
                      setFormData(defaultData);
                      localStorage.removeItem('magicPublishingSetup');
                    }}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                  
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdatingUser}
                    className="px-6 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isUpdatingUser ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default MagicPublishingSetup;
