import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SuccessMetricsSectionProps {
  onSubmit: (data: SuccessMetricsData) => void;
  className?: string;
  error?: string;
}

interface SuccessMetricsData {
  numberOfBookings: string;
  emailListSize: string;
  amountInSales: string;
  amountInDonations: string;
}

const SuccessMetricsSection: React.FC<SuccessMetricsSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  const [formData, setFormData] = useState({
    numberOfBookings: '',
    emailListSize: '',
    amountInSales: '',
    amountInDonations: ''
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
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        DEFINE YOUR SUCCESS
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: Number of Bookings & Email List Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[16px]">
          <div className="relative firstVerifyScreen group" >
            <select
              value={formData.numberOfBookings}
              onChange={(e) => handleInputChange('numberOfBookings', e.target.value)}
              className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
             
            >
              <option value="">Number of Bookings</option>
              <option value="0-10">0-10</option>
              <option value="11-50">11-50</option>
              <option value="51-100">51-100</option>
              <option value="101-500">101-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
          
          <div className="relative firstVerifyScreen group" >
            <select
              value={formData.emailListSize}
              onChange={(e) => handleInputChange('emailListSize', e.target.value)}
              className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
             
            >
              <option value="">Email List Size</option>
              <option value="0-100">0-100</option>
              <option value="101-500">101-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1001-5000">1001-5000</option>
              <option value="5001-10000">5001-10000</option>
              <option value="10000+">10000+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
        </div>

        {/* Row 2: Amount in Sales & Amount in Donations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[16px]">
          <div className="relative firstVerifyScreen group" >
            <select
              value={formData.amountInSales}
              onChange={(e) => handleInputChange('amountInSales', e.target.value)}
              className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            
            >
              <option value="">Amount in Sales</option>
              <option value="0-10k">$0 - $10K</option>
              <option value="10k-50k">$10K - $50K</option>
              <option value="50k-100k">$50K - $100K</option>
              <option value="100k-500k">$100K - $500K</option>
              <option value="500k-1m">$500K - $1M</option>
              <option value="1m+">$1M+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
          
          <div className="relative firstVerifyScreen group" >
            <select
              value={formData.amountInDonations}
              onChange={(e) => handleInputChange('amountInDonations', e.target.value)}
              className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
            
            >
              <option value="">Amount in Donations</option>
              <option value="0-1k">$0 - $1K</option>
              <option value="1k-5k">$1K - $5K</option>
              <option value="5k-10k">$5K - $10K</option>
              <option value="10k-50k">$10K - $50K</option>
              <option value="50k-100k">$50K - $100K</option>
              <option value="100k+">$100K+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
          </div>
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
        /* Style the dropdown list content (options) */
        select option {
          background-color: #fef2f2 !important;
          color: #374151 !important;
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

export default SuccessMetricsSection;
