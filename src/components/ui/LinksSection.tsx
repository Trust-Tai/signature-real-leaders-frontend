import React, { useState, useRef, useEffect } from 'react';
import { 
  FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaLinkedin, FaFacebook, FaPodcast, FaBlog, FaHandshake, FaHeart, FaXTwitter
} from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';
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
  // State for dropdown-based link management
  const suggestedItems: { label: string; icon: React.ReactNode; placeholder?: string }[] = [
    { label: 'Work With Me', icon: <FaHandshake style={{ color: '#1CA235' }} />, placeholder: 'https://your-website.com/work-with-me' },
    { label: 'Donations', icon: <FaHeart style={{ color: '#e74c3c' }} />, placeholder: 'https://donate.example.com/your-handle' },
    { label: 'Podcast', icon: <FaPodcast style={{ color: '#8e44ad' }} />, placeholder: 'https://podcasts.apple.com/...' },
    { label: 'Instagram', icon: <FaInstagram style={{ color: '#E4405F' }} />, placeholder: 'https://instagram.com/yourhandle' },
    { label: 'TikTok', icon: <FaTiktok style={{ color: '#000000' }} />, placeholder: 'https://tiktok.com/@yourhandle' },
    { label: 'YouTube', icon: <FaYoutube style={{ color: '#FF0000' }} />, placeholder: 'https://youtube.com/@yourchannel' },
    { label: 'Spotify', icon: <FaSpotify style={{ color: '#1DB954' }} />, placeholder: 'https://open.spotify.com/show/...' },
    { label: 'LinkedIn', icon: <FaLinkedin style={{ color: '#0077B5' }} />, placeholder: 'https://linkedin.com/in/yourhandle' },
    { label: 'Twitter/X', icon: <FaXTwitter style={{ color: '#000000' }} />, placeholder: 'https://x.com/yourhandle' },
    { label: 'Facebook', icon: <FaFacebook style={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/yourpage' },
    { label: 'Blog', icon: <FaBlog style={{ color: '#FF6B35' }} />, placeholder: 'https://your-website.com/blog' },
    { label: 'Maps', icon: <FaMapMarkedAlt style={{ color: '#34A853' }} />, placeholder: 'https://maps.app.goo.gl/...' },
  ];
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [itemValues, setItemValues] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherLabel, setOtherLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleSuggested = (label: string) => {
    const next = new Set(expandedItems);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    setExpandedItems(next);
  };
  const setSuggestedValue = (label: string, value: string) => {
    setItemValues(prev => ({ ...prev, [label]: value }));
  };

  const handleOtherSubmit = () => {
    if (otherLabel.trim() && !expandedItems.has(otherLabel.trim())) {
      const newExpanded = new Set(expandedItems);
      newExpanded.add(otherLabel.trim());
      setExpandedItems(newExpanded);
      setOtherLabel('');
      setShowOtherInput(false);
    }
  };

  const handleSubmit = () => {
    const suggestedFilled = Object.entries(itemValues)
      .filter(([, v]) => v && v.trim() !== '')
      .map(([, v]) => v.trim());
    console.log('LinksSection: Submitting links array:', suggestedFilled);
    onSubmit(suggestedFilled);
  };

 


  return (
    <div className={cn("text-center space-y-8 animate-fade-in-up", className)}>
      {/* Section Heading - Fixed at top */}
      <h2 className="section-title animate-fade-in-down flex-shrink-0">
        THIS IS WHAT YOU WANT YOUR AUDIENCE TO SEE WHEN THEY COME TO YOUR LINK.
      </h2>

      {/* Suggested list and form */}
      <div className={"space-y-6"}>
        {/* Suggested items dropdown */}
        <div className="text-left space-y-4">
          <p className="font-outfit font-semibold text-gray-800">Add Your Links</p>
          
          {/* Custom styled dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-4 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-custom-red/30 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-custom-red/10 to-custom-red/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-custom-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">+ Add a link (select from suggestions)</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  {suggestedItems.map(({label, icon}) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        if (!expandedItems.has(label)) {
                          toggleSuggested(label);
                        }
                        setIsDropdownOpen(false);
                      }}
                      disabled={expandedItems.has(label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        expandedItems.has(label) 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-50 hover:shadow-sm text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      <span className="font-medium">{label}</span>
                      {expandedItems.has(label) && (
                        <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Added
                        </span>
                      )}
                    </button>
                  ))}
                  
                  {/* Other option */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtherInput(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 hover:shadow-sm text-gray-700"
                    >
                      <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="font-medium">Other (Custom)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other input inline */}
          {showOtherInput && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">Custom Link</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={otherLabel}
                    onChange={(e) => setOtherLabel(e.target.value)}
                    placeholder="Enter link name (e.g., My Website, Portfolio)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300"
                    style={{ color: '#333333' }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleOtherSubmit}
                      disabled={!otherLabel.trim()}
                      className="flex-1 bg-custom-red text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-custom-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtherInput(false);
                        setOtherLabel('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected items with inputs */}
          {expandedItems.size > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">Your Links:</p>
              {Array.from(expandedItems).map((label) => {
                const item = suggestedItems.find(i => i.label === label);
                const isCustomItem = !item; // Custom items won't be found in suggestedItems
                return (
                  <div key={label} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {isCustomItem ? (
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-2xl">{item.icon}</span>
                        )}
                        <span className="font-medium text-gray-800">{label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newExpanded = new Set(expandedItems);
                          newExpanded.delete(label);
                          setExpandedItems(newExpanded);
                          // Clear the value when removing
                          setSuggestedValue(label, '');
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={itemValues[label] || ''}
                      onChange={(e) => setSuggestedValue(label, e.target.value)}
                      placeholder={isCustomItem ? 'Enter URL' : item?.placeholder || 'Enter URL'}
                      className="w-full px-3 py-2 text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual inputs removed per request */}

        {/* Submit Button and Error */}
        <div className="space-y-4">
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