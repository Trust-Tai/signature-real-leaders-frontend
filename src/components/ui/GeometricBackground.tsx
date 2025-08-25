import React from 'react';

const GeometricBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-20 bg-custom-red transform rotate-45 rounded-sm shadow-2xl opacity-90"></div>
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-custom-red transform -rotate-12 rounded-full shadow-2xl opacity-80"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-custom-red transform rotate-90 rounded-sm shadow-2xl opacity-70"></div>
    </div>
  );
};

export default GeometricBackground;
