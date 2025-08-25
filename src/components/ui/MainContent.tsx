import React from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex-1 bg-gradient-to-br from-pink-50 to-blue-50 relative overflow-hidden min-w-0 min-h-screen w-full",
      className
    )}>
      {children}
    </div>
  );
};

export default MainContent;
