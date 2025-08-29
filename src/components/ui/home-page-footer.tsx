// import { images } from '@/assets';
// import Image from 'next/image';
// import React from 'react';
// import { useRouter } from "next/navigation";

// const FooterBanner = () => {
//     const router = useRouter();
//   return (
//     <footer className="w-full bg-[#f9efef]">
//       {/* Main Banner - Red Box */}
//       <div className="relative bg-[#CF3232] text-center mx-auto rounded-[10px] flex items-center justify-center" 
//            style={{ width: '1622px', height: '346px', bottom: '-180px', zIndex: 10 }}>
        
//         {/* Content Container */}
//         <div className="w-full max-w-[719px] h-[175px] flex flex-col items-center justify-center px-4">
          
//           {/* Main Heading */}
//           <h1 
//             className="text-white font-semibold font-outift text-center mb-[50]"
//             style={{
//               fontFamily: 'Outfit',
//               fontSize: 'clamp(32px, 4vw, 46px)',
//               lineHeight: '100%',
//               letterSpacing: '0.05em'
//             }}
//           >
//             Our Platform, Your Sign
//             <span className="text-black">a</span>
//             <span className="text-white">ture.</span>
//           </h1>
          
//           {/* Button */}
//           <button 
//           onClick={()=>router.push("/name-verification")}
//             className="text-white  mb-4 hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
//             style={{
//               backgroundColor: '#1A1B20',
//               width: '251px',
//               height: '64px',
//               borderRadius: '5px',
//               padding: '22px 30px',
//               fontFamily: 'Abolition Test',
//               fontSize: '26px',
              
//             }}
//           >
//             CLAIM YOUR SIGNATURE LINK
//           </button>
          
//           {/* Enterprise Solutions Link */}
//           <button 
//             className="text-white underline hover:text-white/80 transition-colors"
//             style={{
//               fontFamily: 'Outfit',
//               fontWeight: 400,
//               fontSize: '13px',
//               lineHeight: '100%',
//               letterSpacing: '0.05em',
//               textAlign: 'center',
//               textTransform: 'uppercase',
//               textDecorationLine: 'underline',
//               textDecorationStyle: 'solid'
//             }}
//           >
//             SEE ENTERPRISE SOLUTIONS
//           </button>
//         </div>
//       </div>

//       {/* Black Background - Only 315px height */}
//       <div className="bg-black relative" style={{ height: '315px' }}>
//         {/* Footer Content at Bottom */}
//         <div className="absolute bottom-0 w-full max-w-[1621px] mx-auto px-6 flex justify-between items-center mb-[50] left-1/2 transform -translate-x-1/2">
//         <Image alt='' src={images.realLeaders} />
//           <div 
//             className="text-white"
//             style={{
//               fontFamily: 'Outfit, sans-serif',
//               fontWeight: 400,
//               fontSize: '16px',
//               lineHeight: '100%',
//               letterSpacing: '0%',
//               textAlign: 'right',
//               textTransform: 'capitalize'
//             }}
//           >
//             © 2025 RealLeaders. All Rights Reserved.
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default FooterBanner;

import { images } from '@/assets';
import Image from 'next/image';
import React from 'react';
import { useRouter } from "next/navigation";

const FooterBanner = () => {
  const router = useRouter();
  return (
    <footer className="w-full bg-[#f9efef]">
      {/* Main Banner - Red Box - Responsive */}
      <div 
        className="relative bg-[#CF3232] text-center mx-auto rounded-[10px] flex items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-[1622px]" 
        style={{ 
          height: 'clamp(250px, 25vw, 346px)', 
          bottom: 'clamp(-120px, -12vw, -180px)', 
          zIndex: 10 
        }}
      >
        
        {/* Content Container - Responsive */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[719px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
          
          {/* Main Heading - Responsive Typography */}
          <h1 
            className="text-white font-semibold font-outfit text-center mb-4 sm:mb-6 md:mb-8 lg:mb-[50px]"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(24px, 5vw, 46px)',
              lineHeight: '100%',
              letterSpacing: '0.05em',
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}
          >
            Our Platform, Your Sign
            <span className="text-black">a</span>
            <span className="text-white">ture.</span>
          </h1>
          
          {/* Button - Responsive */}
          <button 
            onClick={() => router.push("/name-verification")}
            className="text-white mb-2 sm:mb-3 md:mb-4 hover:bg-gray-800 transition-colors inline-flex items-center justify-center px-2 sm:px-6 md:px-8"
            style={{
              backgroundColor: '#1A1B20',
              width: 'clamp(280px, 70vw, 251px)',
              height: 'clamp(50px, 10vw, 64px)',
              borderRadius: '5px',
              fontFamily: 'Abolition Test, Arial Black, sans-serif',
              fontSize: 'clamp(12px, 2.5vw, 26px)',
              textAlign: 'center',
              lineHeight: '1.1',
              color: '#ffffff',
              fontWeight: 'bold'
            }}
          >
            <span className="hidden sm:inline">CLAIM YOUR SIGNATURE LINK</span>
            <span className="sm:hidden text-center leading-tight">CLAIM YOUR<br/>SIGNATURE LINK</span>
          </button>
          
          {/* Enterprise Solutions Link - Responsive */}
          <button 
            className="text-white underline hover:text-white/80 transition-colors px-2 py-1"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(10px, 2vw, 13px)',
              lineHeight: '100%',
              letterSpacing: '0.05em',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid'
            }}
          >
            <span className="hidden md:inline">SEE ENTERPRISE SOLUTIONS</span>
            <span className="md:hidden">ENTERPRISE SOLUTIONS</span>
          </button>
        </div>
      </div>

      {/* Black Background - Full Width - Responsive Height */}
      <div 
        className="bg-black relative" 
        style={{ 
          height: 'clamp(200px, 25vw, 315px)',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)'
        }}
      >
        {/* Footer Content at Bottom - Responsive Layout */}
        <div className="absolute bottom-0 w-full max-w-[1621px] mx-auto px-4 sm:px-6 lg:px-8 left-1/2 transform -translate-x-1/2">
          
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col sm:hidden items-center justify-center mb-4 space-y-4">
            <Image 
              alt='' 
              src={images.realLeaders} 
              className="max-w-[120px] h-auto"
            />
            <div 
              className="text-white text-center"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textTransform: 'capitalize'
              }}
            >
              © 2025 RealLeaders. All Rights Reserved.
            </div>
          </div>

          {/* Tablet & Desktop Layout - Side by Side */}
          <div className="hidden sm:flex justify-between items-center mb-6 sm:mb-8 lg:mb-[50px]">
            <Image 
              alt='' 
              src={images.realLeaders} 
              className="max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-none h-auto"
            />
            <div 
              className="text-white"
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(12px, 2vw, 16px)',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'right',
                textTransform: 'capitalize'
              }}
            >
              © 2025 RealLeaders. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBanner;