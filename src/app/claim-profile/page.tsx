'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { ChevronDown, Upload, X } from 'lucide-react';

interface ClaimProfileFormData {
  company_name: string;
  first_name: string;
  last_name: string;
  website: string;
  linkedin_url: string;
  email: string;
  industry: string;
  profile_use: string;
}

const InnerClaimProfilePage = () => {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClaimProfileFormData>({
    company_name: '',
    first_name: '',
    last_name: '',
    website: '',
    linkedin_url: '',
    email: '',
    industry: '',
    profile_use: ''
  });

  const [customIndustry, setCustomIndustry] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const profileUseOptions = [
    "CEO / Business Leader",
    "Investor — Fund Manager, VC, Angel Investor or Family Office",
    "Speaker / Thought Leader",
    "Chair / Advisor — Board Member, Coach or Consultant"
  ];

  // Industry options list (same as profile-verification and dashboard profile)
  const industryOptions = [
    "Construction",
    "Energy & Facilities",
    "Consumer Packed Goods (CPG)",
    "Education/Training",
    "Fashion/Apparel",
    "Financial services",
    "Food & Beverage (Non-CPG)",
    "Healthcare",
    "Home & Lifestyle",
    "Insurance",
    "Manufacturing/Industrial",
    "Marketing & Media",
    "Membership/Community",
    "Personal Care & Wellness",
    "Professional/Advisory and Consulting Services",
    "Real Estate",
    "Social Enterprise & Education",
    "Staffing/Recruiting",
    "Travel and Hospitality",
    "Technology"
  ];

  // Check if current industry is in predefined options
  const isCustomIndustry = (industry: string) => {
    return industry && !industryOptions.includes(industry) && industry !== "Other" && industry !== "";
  };

  // Redirect if no ID provided
  useEffect(() => {
    if (!profileId) {
      toast.error('Profile ID is required');
      // Redirect to home or appropriate page
      window.location.href = '/';
    }
  }, [profileId]);

  const handleInputChange = (field: keyof ClaimProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileId) {
      toast.error('Profile ID is missing');
      return;
    }

    // Validate required fields
    const requiredFields: (keyof ClaimProfileFormData)[] = ['company_name', 'first_name', 'last_name', 'website', 'linkedin_url', 'email', 'industry', 'profile_use'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const result = await api.claimProfile({
        id: parseInt(profileId, 10),
        company_name: formData.company_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        website: formData.website,
        linkedin: formData.linkedin_url,
        email: formData.email,
        industry: formData.industry,
        profile_use: formData.profile_use
      }, profileImage);

      if (result.success) {
        toast.success(result.message || 'Your account is pending review. Please wait for admin approval.');
        // Reset form
        setFormData({
          company_name: '',
          first_name: '',
          last_name: '',
          website: '',
          linkedin_url: '',
          email: '',
          industry: '',
          profile_use: ''
        });
        setCustomIndustry('');
        setProfileImage(null);
        setImagePreview(null);
      } else {
        toast.error(result.message || 'Failed to submit profile claim');
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting your claim';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!profileId) {
    return <LoadingScreen text1="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Claim Your <span className="text-red-500">Profile</span>
            </h1>
            <p className="text-gray-300 text-sm mb-2">
              Profile ID: <span className="text-white font-semibold">{profileId}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Fill in the details below to claim this profile
            </p>
          </div>

          {/* Claim Profile Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-200 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-200 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter last name"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-200 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter company name"
                  required
                />
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-200 mb-2">
                  Website *
                </label>
                <input
                  type="url"
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-200 mb-2">
                  LinkedIn URL *
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://linkedin.com/in/username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Profile Headshot (Optional)
                </label>
                <div className="space-y-3">
                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full">
                      <div className="relative w-32 h-32 mx-auto">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-center text-sm text-gray-400 mt-2">
                        {profileImage?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Use */}
              <div>
                <label htmlFor="profile_use" className="block text-sm font-medium text-gray-200 mb-2">
                  What best describes how you plan to use your profile? *
                </label>
                <div className="relative">
                  <select
                    id="profile_use"
                    value={formData.profile_use}
                    onChange={(e) => handleInputChange('profile_use', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-10"
                    required
                  >
                    <option value="">Select an option</option>
                    {profileUseOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-200 mb-2">
                    Industry *
                  </label>
                  <div className="relative">
                    <select
                      id="industry"
                      value={isCustomIndustry(formData.industry) ? 'Other' : formData.industry}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          handleInputChange('industry', 'Other');
                          if (!customIndustry && isCustomIndustry(formData.industry)) {
                            setCustomIndustry(formData.industry);
                          }
                        } else {
                          handleInputChange('industry', e.target.value);
                          setCustomIndustry('');
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-10"
                      required
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>
                
                {/* Custom Industry Input - Shows when "Other" is selected OR when user has custom industry */}
                {(formData.industry === 'Other' || isCustomIndustry(formData.industry)) && (
                  <div>
                    <input
                      type="text"
                      value={customIndustry || (isCustomIndustry(formData.industry) ? formData.industry : '')}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      onBlur={() => {
                        if (customIndustry.trim()) {
                          handleInputChange('industry', customIndustry.trim());
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter your industry"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black mt-6"
              >
                {loading ? 'Submitting...' : 'Claim Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Interactive Magazine Cards */}
      <div className="hidden lg:block w-1/2">
        <InteractiveMagazineCards />
      </div>

      {/* Custom styles for the dropdown */}
      <style jsx global>{`
        select option {
          background-color: white !important;
          color: black !important;
          padding: 8px 12px !important;
        }
        
        select option:hover {
          background-color: #fee2e2 !important;
        }
        
        select option:checked {
          background-color: #ef4444 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

const ClaimProfilePage = () => (
  <Suspense fallback={<LoadingScreen text1="Loading..." />}>
    <InnerClaimProfilePage />
  </Suspense>
);

export default ClaimProfilePage;