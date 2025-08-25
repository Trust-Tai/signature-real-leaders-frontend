import React, { useState } from 'react';
import { cn } from '@/lib/utils';

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
    <div className={cn("text-center space-y-8", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        DEFINE YOUR SUCCESS
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: Number of Bookings & Email List Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.numberOfBookings}
            onChange={(e) => handleInputChange('numberOfBookings', e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10 firstVerifyScreenInput"
            style={{
              border: '10px solid #CF323240',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Number of Bookings</option>
            <option value="0-10">0-10</option>
            <option value="11-50">11-50</option>
            <option value="51-100">51-100</option>
            <option value="101-500">101-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1000+">1000+</option>
          </select>
          
          <select
            value={formData.emailListSize}
            onChange={(e) => handleInputChange('emailListSize', e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10 firstVerifyScreenInput"
            style={{
              border: '10px solid #CF323240',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Email List Size</option>
            <option value="0-100">0-100</option>
            <option value="101-500">101-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5001-10000">5001-10000</option>
            <option value="10000+">10000+</option>
          </select>
        </div>

        {/* Row 2: Amount in Sales & Amount in Donations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={formData.amountInSales}
            onChange={(e) => handleInputChange('amountInSales', e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10 firstVerifyScreenInput"
            style={{
              border: '10px solid #CF323240',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Amount in Sales</option>
            <option value="0-10k">$0 - $10K</option>
            <option value="10k-50k">$10K - $50K</option>
            <option value="50k-100k">$50K - $100K</option>
            <option value="100k-500k">$100K - $500K</option>
            <option value="500k-1m">$500K - $1M</option>
            <option value="1m+">$1M+</option>
          </select>
          
          <select
            value={formData.amountInDonations}
            onChange={(e) => handleInputChange('amountInDonations', e.target.value)}
            className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 appearance-none bg-no-repeat bg-right pr-10 firstVerifyScreenInput"
            style={{
              border: '10px solid #CF323240',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="">Amount in Donations</option>
            <option value="0-1k">$0 - $1K</option>
            <option value="1k-5k">$1K - $5K</option>
            <option value="5k-10k">$5K - $10K</option>
            <option value="10k-50k">$10K - $50K</option>
            <option value="50k-100k">$50K - $100K</option>
            <option value="100k+">$100K+</option>
          </select>
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
