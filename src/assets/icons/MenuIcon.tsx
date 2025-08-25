import React from 'react';

interface MenuIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const MenuIcon: React.FC<MenuIconProps> = ({ 
  className = '', 
  size = 20, 
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      fill="none" 
      stroke={color} 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={strokeWidth} 
        d="M4 6h16M4 12h16M4 18h16" 
      />
    </svg>
  );
};

export default MenuIcon;
