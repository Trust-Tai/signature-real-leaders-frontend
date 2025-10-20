"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Age ranges
const ageRanges = [
  '18-24',
  '25-34', 
  '35-44',
  '45-54',
  '55-64',
  '65+'
];

interface AudienceDescriptionSectionProps {
  onSubmit: (data: { name: string; age_range: string; demographic_details: string }) => void;
  className?: string;
  error?: string;
}

const AudienceDescriptionSection: React.FC<AudienceDescriptionSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age_range: '',
    demographic_details: ''
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

  const isFormValid = formData.name.trim() !== '' && formData.age_range !== '' && formData.demographic_details.trim() !== '';

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        DESCRIBE YOUR AUDIENCE
      </h2>

     
      <p className="font-outfit mx-auto leading-relaxed text-center px-4 animate-fade-in" style={{ color: '#333333B2', fontSize: 18, fontWeight: 400, width: 'clamp(280px, 90vw, 485px)' }}>
       Describe Your Target Audience(s) who you want to reach such as industry, job title, age, location, and pain points.
      </p>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Audience Name and Age Range in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px]">
          <div className='firstVerifyScreen group'>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
              style={{ color: '#949494' }}
              placeholder="Audience Name"
            />
          </div>
          <div className="relative firstVerifyScreen group">
            <select
              value={formData.age_range}
              onChange={(e) => handleInputChange('age_range', e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            >
              <option value="">Age Range</option>
              {ageRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </div>

        {/* Demographic Details - same height as previous textarea */}
        <div className='h-[270] rounded-[10px] group' style={{
          borderColor: '#efc0c0',
          border: 'clamp(6px, 1.5vw, 10px) solid rgba(207, 50, 50, 0.25)'
        }}>
          <textarea
            value={formData.demographic_details}
            onChange={(e) => handleInputChange('demographic_details', e.target.value)}
            className={cn(
              "w-full text-gray-700 placeholder-gray-400 bg-white",
              "focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300",
              "resize-none min-h-[250px] firstVerifyScreenInput",
              "transform hover:scale-[1.01] hover:shadow-lg focus:scale-[1.01] focus:shadow-xl",
              error && "border-custom-red focus:border-custom-red"
            )}
            style={{
              padding: '16px 16px'
            }}
            placeholder="Describe your target audience(s) - industry, job title, age, location, and pain points..."
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
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

export default AudienceDescriptionSection;
