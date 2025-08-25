import React from 'react';
import { cn } from '@/lib/utils';
import Image, { StaticImageData } from "next/image";

interface RightImageSectionProps {
  className?: string;
  imageUrl?:string | StaticImageData
}

const RightImageSection: React.FC<RightImageSectionProps> = ({ 
  className,

  imageUrl=""
}) => {
  
  return (
    <div className={cn(
      "hidden xl:block xl:w-[364px] flex-shrink-0 bg-gradient-to-l from-blue-400 to-blue-300 relative overflow-hidden min-h-screen",
      className
    )}>
       <Image
          src={imageUrl}
          alt="Right Section"
          className="object-cover w-full h-screen"
        />
    </div>
  );
};

export default RightImageSection;
