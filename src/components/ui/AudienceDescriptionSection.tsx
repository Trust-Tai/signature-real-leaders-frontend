import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AudienceDescriptionSectionProps {
  onSubmit: (description: string) => void;
  className?: string;
  error?: string;
}

const AudienceDescriptionSection: React.FC<AudienceDescriptionSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit(description);
  };

  const isFormValid = description.trim().length >= 10;

  return (
    <div className={cn("text-center space-y-8", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        DESCRIBE YOUR AUDIENCE
      </h2>

     
      <p className="text-gray-600 text-lg font-outfit mx-auto leading-relaxed text-center max-w-2xl px-4">
       Describe Your Target Audience(s) who you want to reach such as industry, job title, age, location, and pain points.
      </p>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(
              "w-full px-6 py-4  text-gray-700 placeholder-gray-400 bg-white rounded-2xl",
              "focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200",
              "resize-none min-h-[120px] firstVerifyScreenInput",
              error && "border-custom-red focus:border-custom-red"
            )}
            style={{ border: '10px solid #CF323240' }}
            placeholder="Write a short description here......"
            rows={5}
          />
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
    </div>
  );
};

export default AudienceDescriptionSection;
