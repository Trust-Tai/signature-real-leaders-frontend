'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';
import FooterBanner from '@/components/ui/home-page-footer';
import { useRouter } from "next/navigation";
export default function UserProfile() {
    const router = useRouter()
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    occupation: '',
    email: ''
  });
 

  // Check if all required fields are filled
  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.surname.trim() !== '' && 
           formData.age.trim() !== '' && 
           formData.occupation.trim() !== '' && 
           formData.email.trim() !== '';
  };

  // Handle checkbox click
  const handleNewsletterClick = () => {
    setNewsletterModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (isFormValid()) {
      setEmailSubscribed(true);
      
      setNewsletterModalOpen(false);
      // Here you would typically send the data to your backend
      console.log('Newsletter signup data:', formData);
    }
  };

  // Handle follow button click
  const handleFollow = () => {
   
  };

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
        <Image src={images.profileBgImage} alt='' className='w-full'style={{height:"1440px"}}/>
        </div>
        <div className="absolute inset-0  bg-black/92 h-[1440px]"></div>
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
                onChange={handleNewsletterClick}
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
              onClick={handleFollow}
             
              className={`w-full transition-colors duration-200 text-white rounded-lg mb-4 bg-[#CF3232] hover:bg-red-600 cursor-pointer `}
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

      {/* Newsletter Signup Modal */}
      {newsletterModalOpen && (
        <div 
          className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setNewsletterModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                  Join Our Newsletter
                </h2>
                <button
                  onClick={() => setNewsletterModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Please fill in your details to join our newsletter and follow Richard Branson.
              </p>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                />
              </div>

              {/* Surname */}
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-2">
                  Occupation *
                </label>
                <input
                  type="text"
                  placeholder="Enter your occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setNewsletterModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={!isFormValid()}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  isFormValid()
                    ? 'bg-[#CF3232] text-white hover:bg-red-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Join Newsletter
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterBanner />
    </div>
  );
}