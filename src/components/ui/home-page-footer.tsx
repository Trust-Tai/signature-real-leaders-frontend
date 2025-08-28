import { images } from '@/assets';
import Image from 'next/image';
import React from 'react';
import { useRouter } from "next/navigation";

const FooterBanner = () => {
    const router = useRouter();
  return (
    <footer className="w-full bg-[#f9efef]">
      {/* Main Banner - Red Box */}
      <div className="relative bg-[#CF3232] text-center mx-auto rounded-[10px] flex items-center justify-center" 
           style={{ width: '1622px', height: '346px', bottom: '-180px', zIndex: 10 }}>
        
        {/* Content Container */}
        <div className="w-full max-w-[719px] h-[175px] flex flex-col items-center justify-center px-4">
          
          {/* Main Heading */}
          <h1 
            className="text-white font-semibold font-outift text-center mb-[50]"
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(32px, 4vw, 46px)',
              lineHeight: '100%',
              letterSpacing: '0.05em'
            }}
          >
            Our Platform, Your Sign
            <span className="text-black">a</span>
            <span className="text-white">ture.</span>
          </h1>
          
          {/* Button */}
          <button 
          onClick={()=>router.push("/name-verification")}
            className="text-white  mb-4 hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
            style={{
              backgroundColor: '#1A1B20',
              width: '251px',
              height: '64px',
              borderRadius: '5px',
              padding: '22px 30px',
              fontFamily: 'Abolition Test',
              fontSize: '26px',
              
            }}
          >
            CLAIM YOUR SIGNATURE LINK
          </button>
          
          {/* Enterprise Solutions Link */}
          <button 
            className="text-white underline hover:text-white/80 transition-colors"
            style={{
              fontFamily: 'Outfit',
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '100%',
              letterSpacing: '0.05em',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid'
            }}
          >
            SEE ENTERPRISE SOLUTIONS
          </button>
        </div>
      </div>

      {/* Black Background - Only 315px height */}
      <div className="bg-black relative" style={{ height: '315px' }}>
        {/* Footer Content at Bottom */}
        <div className="absolute bottom-0 w-full max-w-[1621px] mx-auto px-6 flex justify-between items-center mb-[50] left-1/2 transform -translate-x-1/2">
        <Image alt='' src={images.realLeaders} />
          <div 
            className="text-white"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
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
    </footer>
  );
};

export default FooterBanner;