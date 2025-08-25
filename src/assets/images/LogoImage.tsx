import React from 'react';

interface LogoImageProps {
  className?: string;
  width?: number;
  height?: number;
}

const LogoImage: React.FC<LogoImageProps> = ({ 
  className = '', 
  width = 200, 
  height = 60 
}) => {
  return (
    <div 
      className={`bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <span className="text-white font-bold text-xl font-abolition">
        Real Leaders
      </span>
    </div>
  );
};

export default LogoImage;
