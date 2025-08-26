import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface InformationFormSectionProps {
  onSubmit: (data: FormData) => void;
  className?: string;
  error?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  numberOfEmployees: string;
  contactEmailListSize: string;
}

const InformationFormSection: React.FC<InformationFormSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    numberOfEmployees: '',
    contactEmailListSize: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className={cn("text-center space-y-8", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        ENTER YOUR INFORMATION
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className='firstVerifyScreen'>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
            style={{ color: '#949494' }}
            placeholder="First Name"
          />
          </div>
          <div className='firstVerifyScreen'>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
            style={{ color: '#949494' }}
            placeholder="Last Name"
          />
          </div>
        </div>

        {/* Row 2: Company Name & Company Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
           <div className='firstVerifyScreen'>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
            style={{ color: '#949494' }}
            placeholder="Company Name"
          />
          </div>
           <div className='firstVerifyScreen'>
          <input
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
            style={{ color: '#949494' }}
            placeholder="Company Website"
          />
          </div>
        </div>

        {/* Row 3: Industry & Number of Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10]">
          <div className="relative firstVerifyScreen">
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none firstVerifyScreenInput pr-10 select-custom-color"
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
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
          </div>
          
          <div className="relative firstVerifyScreen">
            <select
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none firstVerifyScreenInput pr-10 select-custom-color"
            >
              <option value="">Number of Employees</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
          </div>
        </div>

        {/* Row 4: Contact Email List Size */}
        <div className="relative firstVerifyScreen">
          <select
            value={formData.contactEmailListSize}
            onChange={(e) => handleInputChange('contactEmailListSize', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none firstVerifyScreenInput pr-10 select-custom-color"
          >
            <option value="">Contact email list size</option>
            <option value="0-100">0-100</option>
            <option value="101-500">101-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5001-10000">5001-10000</option>
            <option value="10000+">10000+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="custom-btn"
        >
          CONTINUE
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit">{error}</p>
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
