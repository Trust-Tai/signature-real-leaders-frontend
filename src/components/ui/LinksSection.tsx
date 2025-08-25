import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LinksSectionProps {
  onSubmit: (links: string[]) => void;
  className?: string;
  error?: string;
}

const LinksSection: React.FC<LinksSectionProps> = ({
  onSubmit,
  className,
  error
}) => {
  // Initially show only first 2 inputs
  const [links, setLinks] = useState<string[]>(['', '']);
  const [showThirdInput, setShowThirdInput] = useState(false);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addYouTubeLink = () => {
    setLinks([...links, '']);
    setShowThirdInput(true);
  };

  const handleSubmit = () => {
    const validLinks = links.filter(link => link.trim() !== '');
    onSubmit(validLinks);
  };

  const isFormValid = links.some(link => link.trim() !== '');

  const getPlaceholder = (index: number) => {
    const placeholders = [
      'Work With Me',
      'My Podcast',
      'YouTube Channel'
    ];
    return placeholders[index] || 'Additional Link';
  };

  return (
    <div className={cn("text-center space-y-8", className)}>
      {/* Section Heading */}
      <h2 className="section-title">
        THIS IS WHAT YOU WANT YOUR AUDIENCE TO SEE WHEN THEY COME TO YOUR LINK.
      </h2>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First two inputs - always visible */}
        {links.slice(0, 2).map((link, index) => (
          <div key={index}>
            <input
              type="text"
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              className={cn(
                "w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
              )}
              style={{ border: '10px solid #CF323240' }}
              placeholder={getPlaceholder(index)}
            />
          </div>
        ))}

        {/* Third input - YouTube Channel - only show after clicking Add Link */}
        {showThirdInput && links.length > 2 && (
          <div>
            <input
              type="text"
              value={links[2]}
              onChange={(e) => handleLinkChange(2, e.target.value)}
              className={cn(
                "w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-200 firstVerifyScreenInput"
              )}
              style={{ border: '10px solid #CF323240' }}
              placeholder="YouTube Channel"
            />
          </div>
        )}

        {/* Add Link Button - Only show if third input is not visible */}
        {!showThirdInput && (
          <div className="flex justify-end">
            <button
              onClick={addYouTubeLink}
              className="px-4 py-2 font-outfit transition-colors duration-200 rounded-lg flex items-center space-x-2"
              style={{ 
                border: '1.5px solid #1CA235',
                color: '#1CA235'
              }}
            >
              <span>+</span>
              <span>Add Link</span>
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="custom-btn"
          style={{width:'100%'}}
        >
          NEXT
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-custom-red text-sm font-outfit">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LinksSection;