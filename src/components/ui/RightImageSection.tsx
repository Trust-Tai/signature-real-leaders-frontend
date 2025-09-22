import React from 'react';
import { cn } from '@/lib/utils';
import Image, { StaticImageData } from "next/image";

interface RightImageSectionProps {
  className?: string;
  imageUrl?:string | StaticImageData
  style?: React.CSSProperties;
}

const RightImageSection: React.FC<RightImageSectionProps> = ({ 
  className,
  imageUrl="",
  style
}) => {
  
  return (
    <div className={cn(
      "hidden xl:block xl:w-[320px] flex-shrink-0 bg-gradient-to-l from-blue-400 to-blue-300 relative overflow-hidden min-h-screen group",
      
    )} style={style}>
       <Image
          src={imageUrl}
          alt="Right Section"
          
          className={cn(
      "object-cover w-full h-screen transition-transform duration-1000 ease-in-out group-hover:rotate-12 group-hover:scale-110",
      className
    )}
        />
    </div>
  );
};

export default RightImageSection;
