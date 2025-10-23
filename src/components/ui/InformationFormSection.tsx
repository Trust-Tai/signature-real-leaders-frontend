"use client"

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Camera, Upload } from 'lucide-react';
import {countries} from "../../default/countries"
import Image from 'next/image';



interface InformationFormSectionProps {
  onSubmit: (data: FormData) => void;
  className?: string;
  error?: string;
  initialData?: {
    firstName?: string;
    lastName?: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  numberOfEmployees: string;
  contactEmailListSize: string;
  about: string;
  // Address Fields
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_postcode: string;
  billing_country: string;
  billing_phone: string;
  // Additional Fields
  brand_voice: string;
  unique_differentiation: string;
  top_pain_points: string;
  content_preference_industry: string[];
  primary_call_to_action: string;
  date_of_birth: string;
  occupation: string;
  profilePicture: string;
}

const InformationFormSection: React.FC<InformationFormSectionProps> = ({
  onSubmit,
  className,
  error,
  initialData
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    numberOfEmployees: '',
    contactEmailListSize: '',
    about: '',
    // Address Fields
    billing_address_1: '',
    billing_address_2: '',
    billing_city: '',
    billing_postcode: '',
    billing_country: '',
    billing_phone: '',
    // Additional Fields
    brand_voice: '',
    unique_differentiation: '',
    top_pain_points: '',
    content_preference_industry: [],
    primary_call_to_action: '',
    date_of_birth: '',
    occupation: '',
    profilePicture: ''
  });

  const [customContentPreference, setCustomContentPreference] = useState('');
  const [customIndustries, setCustomIndustries] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle initial data and auto-prefill first name and last name
  useEffect(() => {
    if (initialData) {
      // If both firstName and lastName are provided separately, use them directly
      if (initialData.firstName && initialData.lastName) {
        setFormData(prev => ({
          ...prev,
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || ''
        }));
      } 
      // If only firstName is provided (from the name field), split it by spaces
      else if (initialData.firstName && !initialData.lastName) {
        const nameParts = initialData.firstName.trim().split(' ');
        const firstName = nameParts[0] || ''; // First word goes to firstName
        const lastName = nameParts[1] || ''; // Only second word goes to lastName
        
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName
        }));
      }
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const addCustomIndustry = () => {
    if (customContentPreference.trim() && !formData.content_preference_industry.includes(customContentPreference.trim())) {
      const newIndustry = customContentPreference.trim();
      handleArrayInputChange('content_preference_industry', [...formData.content_preference_industry, newIndustry]);
      setCustomIndustries(prev => [...prev, newIndustry]);
      setCustomContentPreference('');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('profilePicture', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeCustomIndustry = (industryToRemove: string) => {
    handleArrayInputChange('content_preference_industry', 
      formData.content_preference_industry.filter(industry => industry !== industryToRemove)
    );
    setCustomIndustries(prev => prev.filter(industry => industry !== industryToRemove));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = () => {
    const requiredFields = [
      'firstName', 'lastName', 'companyName', 'companyWebsite', 'industry', 
      'numberOfEmployees', 'contactEmailListSize', 'about', 'billing_address_1', 
      'billing_city', 'billing_postcode', 'billing_country', 'billing_phone',
      'brand_voice', 'unique_differentiation', 'top_pain_points', 
      'primary_call_to_action', 'date_of_birth', 'occupation'
    ];
    
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return typeof value === 'string' ? value.trim() !== '' : true;
    }) && formData.content_preference_industry.length > 0;
  };

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        TELL US ABOUT YOU
      </h2>

      {/* Form Fields */}
      <div className="space-y-6" style={{display:"flex",flexDirection:"column"}}>
        {/* Profile Picture Upload - Top Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-custom-red/50 transition-all duration-300 bg-white overflow-hidden"
              onClick={triggerFileInput}
            >
              {formData.profilePicture ? (
                <Image 
                  src={formData.profilePicture} 
                  alt="Profile Preview" 
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Upload Photo</p>
                </div>
              )}
            </div>
            {formData.profilePicture && (
              <button
                type="button"
                onClick={() => handleInputChange('profilePicture', '')}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Choose Profile Picture</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500 text-center">
            Upload a profile picture (max 5MB, JPG/PNG)
          </p>
        </div>

        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className='firstVerifyScreen group'>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="First Name"
          />
          </div>
          <div className='firstVerifyScreen group'>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Last Name"
          />
          </div>
        </div>

        {/* Row 2: Company Name & Company Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
           <div className='firstVerifyScreen group'>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Company Name"
          />
          </div>
           <div className='firstVerifyScreen group'>
          <input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Company Website"
          />
          </div>
        </div>

        {/* Row 3: Industry & Number of Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className="relative firstVerifyScreen group">
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            >
              <option value="">Industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Consulting">Consulting</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
          
          <div className="relative firstVerifyScreen group">
            <select
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            >
              <option value="">Number of Employees</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </div>

        {/* Row 4: Contact Email List Size */}
        <div className="relative firstVerifyScreen group">
          <select
            value={formData.contactEmailListSize}
            onChange={(e) => handleInputChange('contactEmailListSize', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
          >
            <option value="">Contact email list size</option>
            <option value="0-100">0-100</option>
            <option value="101-500">101-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5001-10000">5001-10000</option>
            <option value="10000+">10000+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        </div>

 <div className="firstVerifyScreen group" style={{height:"200px"}}>
          <textarea
            value={formData.about}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494',height:"180px" }}
            placeholder="Tell us a little about yourself and what you do..."
          />
        </div>

        {/* Address Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Address</h3>
        
        {/* Street Address 1 */}
        <div className="firstVerifyScreen group">
          <input
            type="text"
            value={formData.billing_address_1}
            onChange={(e) => handleInputChange('billing_address_1', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Street Address 1"
          />
        </div>

        {/* Street Address 2 */}
        <div className="firstVerifyScreen group">
          <input
            type="text"
            value={formData.billing_address_2}
            onChange={(e) => handleInputChange('billing_address_2', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Street Address 2 (Optional)"
          />
        </div>

        {/* City, Postcode, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-[10]">
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.billing_city}
              onChange={(e) => handleInputChange('billing_city', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="City"
            />
          </div>
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.billing_postcode}
              onChange={(e) => handleInputChange('billing_postcode', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Postcode"
            />
          </div>
          <div className="relative firstVerifyScreen group">
            <select
              value={formData.billing_country}
              onChange={(e) => handleInputChange('billing_country', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            >
              <option value="">Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </div>

        {/* Phone */}
        <div className="firstVerifyScreen group">
          <input
            type="tel"
            value={formData.billing_phone}
            onChange={(e) => handleInputChange('billing_phone', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="Phone Number"
          />
        </div>

        {/* Additional Fields Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>

        {/* Date of Birth & Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className="firstVerifyScreen group">
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Date of Birth"
            />
          </div>
          <div className="firstVerifyScreen group">
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Occupation"
            />
          </div>
        </div>

        {/* Brand Voice */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.brand_voice}
            onChange={(e) => handleInputChange('brand_voice', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="Describe your brand voice and tone..."
          />
        </div>

        {/* Unique Differentiation */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.unique_differentiation}
            onChange={(e) => handleInputChange('unique_differentiation', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="What makes you unique? How do you differentiate from competitors?"
          />
        </div>

        {/* Top Pain Points */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <textarea
            value={formData.top_pain_points}
            onChange={(e) => handleInputChange('top_pain_points', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
            style={{ color: '#949494' }}
            placeholder="What are the top pain points your audience faces?"
          />
        </div>

        {/* Primary Call to Action */}
        <div className="firstVerifyScreen group" style={{height:"auto"}}>
          <input
            type="text"
            value={formData.primary_call_to_action}
            onChange={(e) => handleInputChange('primary_call_to_action', e.target.value)}
            className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            style={{ color: '#949494' }}
            placeholder="What is your primary call to action?"
          />
        </div>

        {/* Content Preference Industry - Multi-select */}
        <div className="firstVerifyScreen group" style={{height:"auto",flexDirection:"column"}}>
          <label className="block text-sm font-medium text-gray-700 mb-4">Content Preference Industry (Select multiple)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Consulting', 'Marketing', 'Real Estate', 'Food & Beverage', 'Travel', 'Fashion'].map((industry) => (
              <label key={industry} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.content_preference_industry.includes(industry)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...formData.content_preference_industry, industry]
                      : formData.content_preference_industry.filter(item => item !== industry);
                    handleArrayInputChange('content_preference_industry', newValue);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-custom-red focus:ring-custom-red focus:ring-2"
                />
                <span className="text-sm text-gray-700 font-medium">{industry}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Industries Display */}
          {customIndustries.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Industries Added:</label>
              <div className="flex flex-wrap gap-2">
                {customIndustries.map((industry, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-custom-red/10 text-custom-red border border-custom-red/20"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => removeCustomIndustry(industry)}
                      className="ml-2 text-custom-red hover:text-red-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Content Preference Input */}
          <div className="mt-4 w-[90%]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Industry (if not listed above)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customContentPreference}
                onChange={(e) => setCustomContentPreference(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomIndustry();
                  }
                }}
                className="firstVerifyScreenInput flex-1 px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                style={{ color: '#949494' }}
                placeholder="Enter custom industry name"
              />
              <button
                type="button"
                onClick={addCustomIndustry}
                disabled={!customContentPreference.trim() || formData.content_preference_industry.includes(customContentPreference.trim())}
                className="custom-btn"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to include the industry</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300" style={{width:"100%"}}
        >
          CONTINUE
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
        )}
      </div>

      {/* Custom CSS for dropdown content styling */}
      <style jsx>{`
        /* Force select color with multiple selectors */
        select,
        select.select-custom-color,
        select.firstVerifyScreenInput {
          color: #949494 !important;
          -webkit-text-fill-color: #949494 !important;
        }
        
        /* Style the dropdown list content (options) */
        select option {
          background-color: #fef2f2 !important;
          color: #949494 !important;
          font-family: 'Outfit', sans-serif !important;
          padding: 12px 16px !important;
          border: 2px solid #CF323240 !important;
          border-radius: 8px !important;
          margin: 2px 0 !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }
        
        select option:hover {
          background-color: #CF323240 !important;
          color: white !important;
        }
        
        select option:checked {
          background-color: #CF3232 !important;
          color: white !important;
          font-weight: 500 !important;
        }
        
        select option:focus {
          background-color: #CF323240 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default InformationFormSection;


// import React, { useState } from 'react';
// import { cn } from '@/lib/utils';
// import { ChevronDown } from 'lucide-react';

// interface InformationFormSectionProps {
//   onSubmit: (data: FormData) => void;
//   className?: string;
//   error?: string;
// }

// interface FormData {
//   firstName: string;
//   lastName: string;
//   companyName: string;
//   companyWebsite: string;
//   industry: string;
//   numberOfEmployees: string;
//   contactEmailListSize: string;
//   about: string; // 👈 नया field
// }

// const InformationFormSection: React.FC<InformationFormSectionProps> = ({
//   onSubmit,
//   className,
//   error
// }) => {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     companyName: '',
//     companyWebsite: '',
//     industry: '',
//     numberOfEmployees: '',
//     contactEmailListSize: '',
//     about: '' // 👈 default empty
//   });

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSubmit = () => {
//     onSubmit(formData);
//   };

//   const isFormValid = Object.values(formData).every(value => value.trim() !== '');

//   return (
//     <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
//       {/* Section Heading */}
//       <h2 className="section-title animate-fade-in-down">
//         ENTER YOUR INFORMATION
//       </h2>

//       <div className="space-y-6">
//         {/* Row 1: First & Last Name */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <input
//             type="text"
//             value={formData.firstName}
//             onChange={(e) => handleInputChange('firstName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="First Name"
//           />
//           <input
//             type="text"
//             value={formData.lastName}
//             onChange={(e) => handleInputChange('lastName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Last Name"
//           />
//         </div>

//         {/* Row 2: Company Name & Website */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <input
//             type="text"
//             value={formData.companyName}
//             onChange={(e) => handleInputChange('companyName', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Company Name"
//           />
//           <input
//             type="url"
//             value={formData.companyWebsite}
//             onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Company Website"
//           />
//         </div>

//         {/* Row 3: Industry & Employees */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
//           <div className="relative group">
//             <select
//               value={formData.industry}
//               onChange={(e) => handleInputChange('industry', e.target.value)}
//               className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//             >
//               <option value="">Industry</option>
//               <option value="Technology">Technology</option>
//               <option value="Healthcare">Healthcare</option>
//               <option value="Finance">Finance</option>
//               <option value="Education">Education</option>
//               <option value="Retail">Retail</option>
//               <option value="Manufacturing">Manufacturing</option>
//               <option value="Consulting">Consulting</option>
//               <option value="Other">Other</option>
//             </select>
//             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//           </div>

//           <div className="relative group">
//             <select
//               value={formData.numberOfEmployees}
//               onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
//               className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//             >
//               <option value="">Number of Employees</option>
//               <option value="1-10">1-10</option>
//               <option value="11-50">11-50</option>
//               <option value="51-200">51-200</option>
//               <option value="201-500">201-500</option>
//               <option value="501-1000">501-1000</option>
//               <option value="1000+">1000+</option>
//             </select>
//             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//           </div>
//         </div>

//         {/* Row 4: Contact Email List Size */}
//         <div className="relative group">
//           <select
//             value={formData.contactEmailListSize}
//             onChange={(e) => handleInputChange('contactEmailListSize', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none pr-10 transform hover:scale-[1.02] hover:shadow-lg"
//           >
//             <option value="">Contact email list size</option>
//             <option value="0-100">0-100</option>
//             <option value="101-500">101-500</option>
//             <option value="501-1000">501-1000</option>
//             <option value="1001-5000">1001-5000</option>
//             <option value="5001-10000">5001-10000</option>
//             <option value="10000+">10000+</option>
//           </select>
//           <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
//         </div>

//         {/* Row 5: About / Note */}
//         <div className="firstVerifyScreen group">
//           <textarea
//             value={formData.about}
//             onChange={(e) => handleInputChange('about', e.target.value)}
//             className="firstVerifyScreenInput w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 resize-none min-h-[100px] transform hover:scale-[1.02] hover:shadow-lg"
//             style={{ color: '#949494' }}
//             placeholder="Tell us a little about yourself and what you do..."
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={handleSubmit}
//           disabled={!isFormValid}
//           className="custom-btn w-full transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
//         >
//           CONTINUE
//         </button>

//         {/* Error Message */}
//         {error && (
//           <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InformationFormSection;
