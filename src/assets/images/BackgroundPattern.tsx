import React from 'react';

interface BackgroundPatternProps {
  className?: string;
  opacity?: number;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ 
  className = '', 
  opacity = 0.1 
}) => {
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900"></div>
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default BackgroundPattern;
