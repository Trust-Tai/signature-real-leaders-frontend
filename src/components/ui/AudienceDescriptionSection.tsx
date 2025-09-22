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
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading */}
      <h2 className="section-title animate-fade-in-down">
        DESCRIBE YOUR AUDIENCE
      </h2>

     
      <p className="font-outfit mx-auto leading-relaxed text-center px-4 animate-fade-in" style={{ color: '#333333B2', fontSize: 18, fontWeight: 400, width: 485 }}>
       Describe Your Target Audience(s) who you want to reach such as industry, job title, age, location, and pain points.
      </p>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className='h-[270] rounded-[10px] group' style={{
          borderColor: '#efc0c0',
          border: 'clamp(6px, 1.5vw, 10px) solid rgba(207, 50, 50, 0.25)'
        }}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            
            placeholder="Write a short description here......"
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
    </div>
  );
};

export default AudienceDescriptionSection;
