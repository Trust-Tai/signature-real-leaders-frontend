import React from 'react';

interface PodiumIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const PodiumIcon: React.FC<PodiumIconProps> = ({ 
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
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
      />
    </svg>
  );
};

export default PodiumIcon;
