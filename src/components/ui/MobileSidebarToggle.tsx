import React from 'react';
import Image from 'next/image';
import { images } from '@/assets';

interface MobileSidebarToggleProps {
  onToggle: () => void;
  className?: string;
}

const MobileSidebarToggle: React.FC<MobileSidebarToggleProps> = ({ onToggle, className }) => {
  return (
    <button
      onClick={onToggle}
      className={`xl:hidden fixed top-4 left-4 z-50 p-2 hover:opacity-80 transition-opacity ${className}`}
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
