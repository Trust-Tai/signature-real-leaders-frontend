import React from 'react';
import Image from 'next/image';
import { images } from '@/assets';

interface MobileSidebarToggleProps {
  onToggle: () => void;
  className?: string;
  isOpen?: boolean;
}

const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ onToggle, className, isOpen = false }) => {
  return (
    <button
      onClick={onToggle}
      className={`xl:hidden fixed top-4 right-4 z-20 p-2 hover:opacity-80 transition-opacity ${isOpen ? 'hidden' : ''} ${className}`}
      aria-label="Toggle mobile sidebar"
    >
      <Image
        src={images.sideToolBarBlack}
        alt="Sidebar toggle"
        className="w-8 h-8 cursor-pointer"
      />
    </button>
  );
};

export default MobileSidebarToggle;
