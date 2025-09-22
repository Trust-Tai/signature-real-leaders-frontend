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
  const [visibleInputs, setVisibleInputs] = useState(2);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    if (visibleInputs < 16) {
      // Make sure we have enough empty strings in links array
      const newLinks = [...links];
      while (newLinks.length <= visibleInputs) {
        newLinks.push('');
      }
      setLinks(newLinks);
      setVisibleInputs(visibleInputs + 1);
    }
  };

  const handleSubmit = () => {
    const validLinks = links.filter(link => link.trim() !== '');
    onSubmit(validLinks);
  };

 

  const getPlaceholder = (index: number) => {
    const placeholders = [
      'Work With Me',
      'My Podcast',
      'YouTube Channel',
      'Donate to my mission',
      'Read My Blog',
      'Download My Free Guide',
      "Instagram",
      "Twitter/X",
      "Facebook",
      "LinkedIn",
      'TikTok',
      'Discord',
      'Patreon',
      'Twitch',
      'Medium',
      'OnlyFans'
    ];
    return placeholders[index] || 'Additional Link';
  };

  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", visibleInputs > 4 ? "h-[700px] flex flex-col" : "", className)}>
      {/* Section Heading - Fixed at top */}
      <h2 className="section-title animate-fade-in-down flex-shrink-0">
        THIS IS WHAT YOU WANT YOUR AUDIENCE TO SEE WHEN THEY COME TO YOUR LINK.
      </h2>

      {/* Form Container - Conditional scrolling */}
      <div className={visibleInputs > 4 ? "flex-1 flex flex-col min-h-0" : "space-y-6"}>
        {/* Links Area - Only scrollable when needed */}
        <div className={visibleInputs > 4 ? "flex-1 overflow-y-auto pr-2 space-y-6" : "space-y-6"} style={visibleInputs > 4 ? {scrollbarWidth: 'none', msOverflowStyle: 'none'} : {}}>
          {visibleInputs > 4 && (
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          )}
          {/* Show inputs based on visibleInputs count */}
          {links.slice(0, visibleInputs).map((link, index) => (
            <div key={index} className='firstVerifyScreen group'>
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className={cn(
                  "w-full px-4 py-3 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                )}
                placeholder={getPlaceholder(index)}
              />
            </div>
          ))}

          {/* Add Link Button - Only show if we haven't reached maximum inputs */}
          {visibleInputs < 16 && (
            <div className="flex justify-end pb-4">
              <button
                onClick={addLink}
                className="px-4 py-2 font-outfit transition-all duration-300 rounded-lg flex items-center space-x-2 transform hover:scale-105 hover:-translate-y-1 active:scale-95"
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
        </div>

        {/* Submit Button and Error - Fixed when scrolling, normal when not */}
        <div className={visibleInputs > 4 ? "flex-shrink-0 pt-4 space-y-4" : "space-y-4"}>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            
            className="custom-btn transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            style={{width:'100%'}}
          >
            NEXT
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-custom-red text-sm font-outfit animate-fade-in">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinksSection;