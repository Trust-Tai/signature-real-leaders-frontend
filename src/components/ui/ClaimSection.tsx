import React from 'react';
import { cn } from '@/lib/utils';

interface ClaimSectionProps {
  onVerify: (value: string) => void;
  className?: string;
  error?: string;
  title?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  buttonText?: string;
}

const ClaimSection: React.FC<ClaimSectionProps> = ({
  onVerify,
  className,
  error,
  title,
  placeholder,
  value,
  onChange,
  buttonText = "VERIFY"
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) {
      onVerify(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn("text-center space-y-6 sm:space-y-8 px-4", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        {title}
      </h2>

      {/* Claim Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Desktop: Input with button inside */}
        <div className="hidden xl:block">
          <div className="firstVerifyScreen flex">
            <input
              type="text"
              value={value || ''}
              onChange={handleInputChange}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-gray-700 rounded-lg focus:outline-none transition-all duration-200 font-outfit firstVerifyScreenInput"
              placeholder={placeholder}
              required
              style={{border:"none"}}
            />
            <button
              type="submit"
              disabled={!value}
              className="firstVerifyScreenButton"
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet: Input and button separate */}
        <div className="xl:hidden">
          {/* Input Field */}
          <div className="firstVerifyScreen">
            <input
              type="text"
              value={value || ''}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-700 rounded-lg focus:outline-none transition-all duration-200 font-outfit firstVerifyScreenInput"
              placeholder={placeholder}
              required
              style={{border:"none"}}
            />
          </div>

          {/* Verify Button - Outside and below input */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={!value}
              className="firstVerifyScreenButton"
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ClaimSection;