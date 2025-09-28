
// import React, { useState } from 'react';
// import { cn } from '@/lib/utils';
// import Image, { StaticImageData } from "next/image";

// interface RightImageSectionProps {
//   className?: string;
//   imageUrl?:string | StaticImageData
//   style?: React.CSSProperties;
// }

// const RightImageSection: React.FC<RightImageSectionProps> = ({ 
//   className,
//   imageUrl="",
//   style
// }) => {
  
//     const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//     const [isHovered, setIsHovered] = useState(false);
  
//     const handleMouseMove = (e) => {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;
//       const mouseX = e.clientX - rect.left;
//       const mouseY = e.clientY - rect.top;
      
//       // Calculate rotation values (-15 to 15 degrees)
//       const rotateX = ((mouseY - centerY) / centerY) * -15;
//       const rotateY = ((mouseX - centerX) / centerX) * 15;
      
//       setMousePosition({ x: rotateY, y: rotateX });
//     };
  
//     const handleMouseEnter = () => {
//       setIsHovered(true);
//     };
  
//     const handleMouseLeave = () => {
//       setIsHovered(false);
//       setMousePosition({ x: 0, y: 0 });
//     };
  

//  return (
//     <div className="h-screen bg-gradient-to-br from-black-900 to-black-800 flex">
  

//       {/* Right Side Preview */}
//       <div 
//         className="bg-black-100 flex items-center justify-center p-6"
//         style={{ width: '400px', height: '100%' }}
//       >
//         <div 
//           className="relative cursor-pointer"
//           style={{ 
//             width: '350px', 
//             height: '800px',
//             perspective: '1000px'
//           }}
//           onMouseMove={handleMouseMove}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           <div 
//             className="relative w-full h-full transition-all duration-300 ease-out"
//             style={{
//               transformStyle: 'preserve-3d',
//               transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) ${isHovered ? 'translateZ(20px)' : 'translateZ(0px)'}`
//             }}
//           >
//             {/* Front Side - Using the Uploaded Image */}
//             <div 
//               className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
//               style={{ 
//                 backfaceVisibility: 'hidden',
//                 boxShadow: isHovered ? '0 25px 50px -12px rgba(59, 130, 246, 0.3)' : '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
//               }}
//             >
//            <Image
//           src={imageUrl}
//           alt="Right Section"
          
//           className={cn(
//       "object-cover w-full h-screen transition-transform duration-1000 ease-in-out group-hover:rotate-12 group-hover:scale-110",
//       className
//     )}
//         />
//             </div>

          
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightImageSection;



import { cn } from "@/lib/utils";


// Define CSS properties with proper typing for InteractiveFollowCard

// Interface for RightImageSection props
interface RightImageSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode; 
}



// RightImageSection component
const RightImageSection: React.FC<RightImageSectionProps> = ({ className, style,children }) => {
  return (
    <div
      className={cn(
        "hidden xl:block xl:w-[400px] flex-shrink-0 bg-gradient-to-br from-black-900 to-black-800 relative overflow-hidden min-h-screen",
        className
      )}
      style={style}
    >
      <div
        className="flex items-center justify-center p-6"
        style={{ width: "400px", height: "100%" }}
      >
        <div
          className="relative"
          style={{
            width: "350px",
            perspective: "1000px",
          }}
        >
          {children}
          {/* <InteractiveFollowCard /> */}
          {/* <InteractiveMagazineCards /> */}
          {/* <SignatureAnimation /> */}
          {/* <UptrendCanvas /> */}
          {/* <NewsletterConnections /> */}
        </div>
      </div>
    </div>
  );
};

export default RightImageSection;