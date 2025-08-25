import React from 'react';
import { SVG_PATHS } from '../index';

interface CheckIconProps {
  className?: string;
  size?: number;
  color?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({ 
  className = '', 
  size = 20, 
  color = 'currentColor' 
}) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      fill={color} 
      viewBox="0 0 20 20"
    >
      <path 
        fillRule="evenodd" 
        d={SVG_PATHS.CHECK} 
        clipRule="evenodd" 
      />
    </svg>
  );
};

export default CheckIcon;
