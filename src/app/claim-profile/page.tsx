'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingScreen } from '@/components';
import { InteractiveMagazineCards } from '@/components/ui/InteractiveMagazineCards';
import { toast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { countries } from '@/default/countries';
import { ChevronDown } from 'lucide-react';

interface ClaimProfileFormData {
  ceo: string;
  website: string;
  linkedin: string;
  share: string;
  email: string;
  location: string;
  industry: string;
}

const InnerClaimProfilePage = () => {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClaimProfileFormData>({
    ceo: '',
    website: '',
    linkedin: '',
    share: '',
    email: '',
    location: '',
    industry: ''
  });

  const [customIndustry, setCustomIndustry] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileId) {
      toast.error('Profile ID is missing');
      return;
    }

    // Validate required fields
    const requiredFields: (keyof ClaimProfileFormData)[] = ['ceo', 'website', 'linkedin', 'share', 'email', 'location', 'industry'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const result = await api.claimProfile({
        id: parseInt(profileId, 10),
        ...formData
      });

      if (result.success) {
        toast.success(result.message || 'Your account is pending review. Please wait for admin approval.');
        // Reset form
        setFormData({
          ceo: '',
          website: '',
          linkedin: '',
          share: '',
          email: '',
          location: '',
          industry: ''
        });
        setCustomIndustry('');
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
              {/* CEO Name */}
              <div>
                <label htmlFor="ceo" className="block text-sm font-medium text-gray-200 mb-2">
                  CEO Name *
                </label>
                <input
                  type="text"
                  id="ceo"
                  value={formData.ceo}
                  onChange={(e) => handleInputChange('ceo', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter CEO name"
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

              {/* LinkedIn */}
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-200 mb-2">
                  LinkedIn Profile *
                </label>
                <input
                  type="url"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://linkedin.com/in/username"
                  required
                />
              </div>

              {/* Share URL */}
              <div>
                <label htmlFor="share" className="block text-sm font-medium text-gray-200 mb-2">
                  Share URL *
                </label>
                <input
                  type="url"
                  id="share"
                  value={formData.share}
                  onChange={(e) => handleInputChange('share', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://example.com/share"
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

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none pr-10"
                    required
                  >
                    <option value="">Select Location</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
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