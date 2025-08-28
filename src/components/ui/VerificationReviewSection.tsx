import React from 'react';
import Image from "next/image";
import {images} from '../../assets/index'
import { useRouter } from "next/navigation";
interface VerificationReviewSectionProps {
  className?: string;
}

const VerificationReviewSection: React.FC<VerificationReviewSectionProps> = ({
  className
}) => {
   const router = useRouter();
  return (
    <div className={`min-h-screen flex items-start justify-center p-4 sm:p-8 ${className || ''}`} 
        style={{marginTop:150}} >
      <div className="text-center space-y-6 sm:space-y-8 max-w-2xl px-4">
        
        {/* Target Icon */}
        <div className="flex justify-center mb-8 sm:mb-12">
           <Image
                    src={images.reviewVerified}
                    alt="Review verified"
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[144px] lg:h-[134px]"
                  />
        </div>

        {/* Main Heading */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight" 
              style={{ 
                color: '#CF3232',
                fontFamily: "Abolition Test",
                fontStyle: 'normal',
                fontSize: '72px',
                fontWeight:400
              }}>
            YOUR SIGNATURE LINK IS<br />
            UNDER REVIEW
          </h1>
          
          {/* Subtitle Text */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-sm sm:text-base leading-relaxed font-outfit font-medium"  style={{ 
                color: '#333333CC'
              }}>
              Your information is under review to ensure verified leadership.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-outfit font-medium" style={{ 
                color: '#333333'
              }}>
              You will receive an email when your link is available.
            </p>
          </div>
        </div>

         <button
          type="submit"
          onClick={()=>router.push("/user-dashboard")}
          className="custom-btn"
        >
           ACCESS DASHBOARD FOR KEVIN
        </button>
      </div>
     
    </div>
  );
};

export default VerificationReviewSection;