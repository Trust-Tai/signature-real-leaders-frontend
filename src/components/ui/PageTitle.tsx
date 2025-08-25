import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  highlightWord?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  className,
  highlightWord
}) => {
  const renderTitle = () => {
    if (!highlightWord) {
      return <span className="text-white header-title">{title}</span>;
    }

    const parts = title.split(highlightWord);
    if (parts.length === 1) {
      return <span className="text-white header-title">{title}</span>;
    }

    return (
      <>
        <span className="text-white header-title">{parts[0]}</span>
        <span className="text-custom-red header-title">{highlightWord}</span>
        <span className="text-white header-title">{parts[1]}</span>
      </>
    );
  };

  return (
    <div className={cn("text-center mb-8", className)}>
      <h1 className="header-title mb-4">
        {renderTitle()}
      </h1>
      {subtitle && (
        <p className="header-subtitle text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
