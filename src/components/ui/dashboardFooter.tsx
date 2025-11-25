'use client';

import React from 'react';

interface FooterProps {
  className?: string;
}

const DashBoardFooter: React.FC<FooterProps> = ({
  className = '',
}) => {
  return (
    <footer
      className={`flex items-center justify-center lg:justify-center px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white flex-shrink-0 ${className}`}
    >
      <div className="text-xs sm:text-sm text-center">
         © 2025 RealLeaders. All Rights Reserved.
      </div>
    </footer>
  );
};

export default DashBoardFooter;
