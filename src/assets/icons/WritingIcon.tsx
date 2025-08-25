import React from 'react';
import { SVG_PATHS } from '../index';

interface WritingIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const WritingIcon: React.FC<WritingIconProps> = ({ 
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
        d={SVG_PATHS.WRITING} 
      />
    </svg>
  );
};

export default WritingIcon;
