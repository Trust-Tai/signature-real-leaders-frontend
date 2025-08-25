import React from 'react';
import { MenuIcon } from '@/assets';

interface MobileMenuToggleProps {
  onToggle: () => void;
  className?: string;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ onToggle, className }) => {
  return (
    <button
      onClick={onToggle}
      className={`xl:hidden fixed top-4 right-4 z-50 bg-custom-red text-white p-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-200 ${className}`}
      aria-label="Toggle mobile menu"
    >
      <MenuIcon size={24} color="white" />
    </button>
  );
};

export default MobileMenuToggle;
