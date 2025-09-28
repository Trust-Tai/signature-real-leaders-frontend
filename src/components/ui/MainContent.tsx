import React from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex-1 bg-[#f9efef] relative overflow-hidden min-w-0 h-full w-full",
      className
    )}>
      {children}
    </div>
  );
};

export default MainContent;
