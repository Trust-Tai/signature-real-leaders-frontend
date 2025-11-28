import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  highlightWord?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  highlightWord,
  className
}) => {

  const renderTitle = () => {
    if (!highlightWord) {
      return <span className="text-gray-800 header-title">{title}</span>;
    }

    const parts = title.split(highlightWord);
    if (parts.length === 1) {
      return <span className="text-gray-800 header-title">{title}</span>;
    }

    return (
      <>
        <span className="text-gray-800 header-title">{parts[0]}</span>
        <span className="text-custom-red header-title">{highlightWord}</span>
        <span className="text-gray-800 header-title">{parts[1]}</span>
      </>
    );
  };

  return (
    <div className={cn("text-center mb-8 sm:mb-12 lg:mb-16 px-4", className)}>
      <h1 className="header-title mb-3 sm:mb-4">
        {renderTitle()}
      </h1>
    </div>
  );
};

export default PageHeader;
