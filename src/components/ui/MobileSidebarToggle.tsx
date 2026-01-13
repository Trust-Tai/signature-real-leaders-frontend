// import React from 'react';
// import Image from 'next/image';
// import { images } from '@/assets';

// interface MobileSidebarToggleProps {
//   onToggle: () => void;
//   className?: string;
//   isOpen?: boolean;
// }

// const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ onToggle, className, isOpen = false }) => {
//   return (
//     <div>
//       <Image
//                     src={images.realLeadersBlack}
//                     alt="Real Leaders"
//                     className={` xl:hidden fixed top-[10px] z-20 p-2 hover:opacity-80 transition-opacity ${isOpen ? 'hidden' : ''}`}
//                   />
//     <button
//       onClick={onToggle}
//       className={`xl:hidden fixed top-4 right-4 z-20 p-2 hover:opacity-80 transition-opacity ${isOpen ? 'hidden' : ''} ${className}`}
//       aria-label="Toggle mobile sidebar"
//     >
//       <Image
//         src={images.sideToolBarBlack}
//         alt="Sidebar toggle"
//         className="w-8 cursor-pointer"
//       />
//     </button>
//    </div>
//   );
// };

// export default MobileSidebarToggle;

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { images } from '@/assets';

interface MobileSidebarToggleProps {
  onToggle: () => void;
  className?: string;
  isOpen?: boolean;
  isScrolled?: boolean; // Accept scroll state from parent
}

const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ 
  onToggle, 
  className, 
  isOpen = false, 
  isScrolled: parentScrolled 
}) => {
  const [internalScrolled, setInternalScrolled] = useState(false);

  // Use parent scroll state if provided, otherwise use internal scroll detection
  const isScrolled = parentScrolled !== undefined ? parentScrolled : internalScrolled;

  useEffect(() => {
    // Only set up internal scroll detection if parent doesn't provide scroll state
    if (parentScrolled === undefined) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setInternalScrolled(true);
        } else {
          setInternalScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [parentScrolled]);

  return (
    <div 
      className={`xl:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="flex-shrink-0">
        <Image
          src={isScrolled ? images.realLeaders : images.realLeadersBlack}
          alt="Real Leaders"
          width={120}
          height={32}
          className="object-contain"
        />
      </div>
      
      <button
        onClick={onToggle}
        className={`p-2 hover:opacity-80 transition-opacity ${isOpen ? 'hidden' : ''} ${className}`}
        aria-label="Toggle mobile sidebar"
      >
        <Image
          src={isScrolled ? images.sideToolBar : images.sideToolBarBlack}
          alt="Sidebar toggle"
          width={32}
          height={32}
          className="cursor-pointer"
        />
      </button>
    </div>
  );
};

export default MobileSidebarToggle;