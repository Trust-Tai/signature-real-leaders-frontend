import React from 'react';

interface GeometricShapesProps {
  variant?: 'default' | 'minimal' | 'complex';
  className?: string;
}

const GeometricShapes: React.FC<GeometricShapesProps> = ({
  variant = 'default',
  className = ''
}) => {
  const renderShapes = () => {
    switch (variant) {
      case 'minimal':
        return (
          <>
            <div className="absolute top-20 right-20 w-32 h-20 bg-custom-red transform rotate-45 rounded-sm shadow-2xl opacity-90"></div>
            <div className="absolute bottom-40 left-10 w-24 h-24 bg-custom-red transform -rotate-12 rounded-full shadow-2xl opacity-80"></div>
          </>
        );
      
      case 'complex':
        return (
          <>
            <div className="absolute top-20 right-20 w-32 h-20 bg-custom-red transform rotate-45 rounded-sm shadow-2xl opacity-90"></div>
            <div className="absolute top-40 right-32 w-24 h-16 bg-white transform rotate-12 rounded-sm shadow-xl"></div>
            <div className="absolute top-60 right-16 w-28 h-18 bg-gray-100 transform -rotate-12 rounded-sm shadow-lg"></div>
            <div className="absolute bottom-60 right-28 w-20 h-14 bg-gray-200 transform rotate-45 rounded-sm shadow-xl"></div>
            <div className="absolute bottom-40 right-12 w-26 h-16 bg-white transform -rotate-6 rounded-sm shadow-2xl"></div>
            <div className="absolute bottom-20 right-36 w-18 h-12 bg-gray-100 transform rotate-30 rounded-sm shadow-lg"></div>
            <div className="absolute top-32 right-8 w-22 h-15 bg-white transform -rotate-15 rounded-sm shadow-xl"></div>
            <div className="absolute top-80 right-24 w-16 h-12 bg-gray-50 transform rotate-60 rounded-sm shadow-lg"></div>
            <div className="absolute bottom-80 right-8 w-20 h-14 bg-white transform -rotate-30 rounded-sm shadow-xl"></div>
          </>
        );
      
      default:
        return (
          <>
            <div className="absolute top-20 right-20 w-32 h-20 bg-custom-red transform rotate-45 rounded-sm shadow-2xl opacity-90"></div>
            <div className="absolute bottom-40 left-10 w-24 h-24 bg-custom-red transform -rotate-12 rounded-full shadow-2xl opacity-80"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-custom-red transform rotate-90 rounded-sm shadow-2xl opacity-70"></div>
          </>
        );
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {renderShapes()}
    </div>
  );
};

export default GeometricShapes;
