'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';
import FooterBanner from '@/components/ui/home-page-footer';
import { useRouter } from "next/navigation";
export default function UserProfile() {
    const router = useRouter()
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  const profileButtons = [
    { 
      icon: images.userProileReel, 
      text: "Video/Reel",
      hasIcon: true,
      isFirst: true
    },
    { 
      text: "Book A Coaching Session",
      hasIcon: false,
      isFirst: false
    },
    { 
      text: "Download My Free Guide",
      hasIcon: false,
      isFirst: false
    },
    { 
      text: "Watch My TEDx Talk",
      hasIcon: false,
      isFirst: false
    },
    { 
      text: "Read My Blog",
      hasIcon: false,
      isFirst: false
    },
    { 
      text: "Donate To My Mission",
      hasIcon: false,
      isFirst: false
    }
  ];

  return (
    <div className="min-h-screen  text-white relative overflow-x-hidden overflow-y-auto">
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat ">
        <Image src={images.profileBgImage} alt='' className='w-full'style={{opacity:'0.08',height:"1250px"}}/>
        </div>
        <div className="absolute inset-0  bg-black/20"></div>
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 z-50">
               <button 
                 className="flex items-center gap-3 text-white group"
                 style={{ fontFamily: 'Abolition, sans-serif' }}
               >
                 <Image src={images.sideToolBar} alt='' />
                 <Image src={images.realLeaders} alt='' />
               </button>

               <div className='mt-[20]' style={{cursor:"pointer"}} onClick={()=>router.back()} ><ArrowLeft size={20} color="#e0d8d8ff" /></div>
             </div>

      {/* Main Content Container with specific positioning */}
      <div className="relative z-20 pb-20 mt-[100px] lg:mt-[30]">
        <div 
          className="relative mx-auto"
          style={{
            width: '504px',
            maxWidth: '90vw',
            minHeight: '1250px',
            marginTop:'25px',
            opacity: 1
          }}
        >
          {/* Profile Image with exact specifications */}
          <div 
            className="relative mx-auto bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center border border-white overflow-hidden mb-8"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '200px',
              borderWidth: '1px',
              opacity: 1
            }}
          >
           <Image src={images.userProfileImage} alt=''/>
          </div>

          {/* Name with Outfit font specifications */}
          <h1 
            className="text-white text-center font-outift font-medium w-full mb-4"
            style={{
              fontSize: '43px',
            }}
          >
            Richard Branson
          </h1>

          {/* Founder title */}
          <p 
            className="text-white text-center w-full font-outift  mb-4"
            style={{
              fontFamily: 'Outfit',
              fontWeight: 400,
              fontSize: '18px',
           
            }}
          >
            Founder Of The Virgin Group,
          </p>

          {/* Description with background */}
          <p 
            className="text-center text-white px-4 py-2 rounded mb-8 mx-auto max-w-md"
            style={{
              fontFamily: 'Outfit',
              fontWeight: 400,
              fontSize: '15px',
            }}
          >
            Which Has Gone On To Grow Successful Businesses In Sectors Including 
            Mobile Telephony, Travel And Transportation.
          </p>

          {/* Menu Items Container */}
          <div className="w-full space-y-4 mb-8">
            {/* Profile Buttons */}
            {profileButtons.map((button, index) => (
              <button
                key={index}
                className="w-full backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-between group px-4"
                style={{
                  height: button.isFirst ? '126px' : '70px',
                  borderRadius: '10px',
                  opacity: 1
                }}
              >
                <div className="flex items-center space-x-3">
                  {button.hasIcon && (
                    
                    <Image src={images.userProileReel} alt='' style={{border:"1px solid white",borderRadius:"3.7px"}}/>
                  )}
                  <span className="text-white text-left font-outfit " style={{fontSize:18,fontWeight:500}}>{button.text}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            ))}

            {/* Signature Box */}
            <div 
              className="w-full backdrop-blur-[20px] bg-white/20 rounded-lg flex items-center justify-center mb-8"
              style={{
                height: '126px',
                borderRadius: '10px',
                opacity: 1
              }}
            >
            <Image src={images.profileSinature} alt=''   />
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-start justify-center space-x-3 mb-6 px-4">
              <input
                type="checkbox"
                id="newsletter"
                checked={emailSubscribed}
                onChange={(e) => setEmailSubscribed(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded mt-[5] focus:ring-red-500 flex-shrink-0"
              />
              <label 
                htmlFor="newsletter" 
                className="text-start"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.2px',
                  letterSpacing: '1%',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                Join Our Newsletter - Get insights and updates delivered to your inbox
              </label>
            </div>

 <button 
              className="w-full bg-[#CF3232]  transition-colors duration-200 text-white rounded-lg mb-4"
              style={{
                height: '60px',
                fontSize:"25px",
                fontFamily:"Abolition Test"
              }}
            >
              FOLLOW
            </button>
            {/* 
           

         
            <p 
              className="text-center w-full"
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              Claim Your{' '}
              <span className="text-red-500 hover:text-red-400 cursor-pointer">
                Signature Link
              </span>{' '}
              Today
            </p> */}
            
          </div>
        </div>
      </div>
      <FooterBanner />
    </div>
  );
}