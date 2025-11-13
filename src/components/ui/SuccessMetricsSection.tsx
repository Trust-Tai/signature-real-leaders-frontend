"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SuccessMetricsSectionProps {
  onSubmit: (data: MetricsData) => void;
  onSkip?: () => void;
  className?: string;
  error?: string;
  initialData?: MetricsData;
}

interface MetricsData {
  numberOfBookings: string;
  emailListSize: string;
  amountInSales: string;
  amountInDonations: string;
}

const SuccessMetricsSection: React.FC<SuccessMetricsSectionProps> = ({
  onSubmit,
  onSkip,
  className,
  error,
  initialData
}) => {
  const [formData, setFormData] = useState<MetricsData>({
    numberOfBookings: initialData?.numberOfBookings || '',
    emailListSize: initialData?.emailListSize || '',
    amountInSales: initialData?.amountInSales || '',
    amountInDonations: initialData?.amountInDonations || ''
  });

  const handleInputChange = (field: keyof MetricsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).some(value => value.trim() !== '');

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        TRACK YOUR SUCCESS METRICS
      </h2>

      <p className="text-gray-600 font-outfit text-center max-w-2xl mx-auto">
        Help us understand your goals and track your progress (Optional)
      </p>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Number of Bookings */}
        <div className="relative firstVerifyScreen group">
          <select
            value={formData.numberOfBookings}
            onChange={(e) => handleInputChange('numberOfBookings', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
          >
            <option value="">Number of Bookings</option>
            <option value="0-10">0-10</option>
            <option value="11-50">11-50</option>
            <option value="51-100">51-100</option>
            <option value="101-500">101-500</option>
            <option value="500+">500+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        </div>

        {/* Email List Size */}
        <div className="relative firstVerifyScreen group">
          <select
            value={formData.emailListSize}
            onChange={(e) => handleInputChange('emailListSize', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
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

        {/* Amount in Sales */}
        <div className="relative firstVerifyScreen group">
          <select
            value={formData.amountInSales}
            onChange={(e) => handleInputChange('amountInSales', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
          >
            <option value="">Amount in Sales</option>
            <option value="0-10k">$0 - $10k</option>
            <option value="10k-50k">$10k - $50k</option>
            <option value="50k-100k">$50k - $100k</option>
            <option value="100k-500k">$100k - $500k</option>
            <option value="500k+">$500k+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        </div>

        {/* Amount in Donations */}
        <div className="relative firstVerifyScreen group">
          <select
            value={formData.amountInDonations}
            onChange={(e) => handleInputChange('amountInDonations', e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 appearance-none firstVerifyScreenInput pr-10 select-custom-color transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
          >
            <option value="">Amount in Donations</option>
            <option value="0-1k">$0 - $1k</option>
            <option value="1k-5k">$1k - $5k</option>
            <option value="5k-10k">$5k - $10k</option>
            <option value="10k-50k">$10k - $50k</option>
            <option value="50k+">$50k+</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-outfit font-medium"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            {isFormValid ? 'CONTINUE' : 'SKIP FOR NOW'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SuccessMetricsSection;
