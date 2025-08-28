import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data - multiple variants
  const slides = [
    {
      label: "REGISTRATION NOW OPEN",
      title: "UNITE ORANGE COUNTY",
      date: "February 10-12, 2027",
      location: "Downtown San Diego, CA",
      buttonText: "LEARN MORE"
    },
    {
      label: "REGISTRATION NOW OPEN",
      title: "UNITE SAN DIEGO",
      date: "February 10-12, 2027", 
      location: "Downtown San Diego, CA",
      buttonText: "LEARN MORE"
    },
    {
      label: "REGISTRATION NOW OPEN",
      title: "UNITE AUSTIN",
      date: "March 12, 2026",
      location: "Austin, TX", 
      buttonText: "LEARN MORE"
    },
    {
      label: "REGISTRATION NOW OPEN",
      title: "UNITE LOS ANGELES",
      date: "February 10-12, 2027",
      location: "Downtown San Diego, CA",
      buttonText: "LEARN MORE"
    },
    {
      label: "REGISTRATION NOW OPEN",
      title: "BUILD YOUR NETWORK",
      date: "February 10-12, 2027",
      location: "Downtown San Diego, CA",
      buttonText: "LEARN MORE"
    }
  ];

  // Auto-change slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/GIF - continuously playing */}
    
       
     
        <div className="absolute inset-0 opacity-100">
               <Image 
                 src={images.eventPageGif}
                 alt="Tech background animation"
                 className="w-full h-full object-cover"
                 style={{ 
                   filter: 'blur(1px) brightness(0.7)'
                 }}
               />
             </div>
    

      {/* Content Card - matches your image exactly */}
      <div 
        className="relative z-10 text-center transition-all duration-800 transform"
        style={{
          animation: 'fadeIn 0.8s ease-out',
          backdropFilter: 'blur(30px)',
          border: 'none',
          width: '777px',
          height: '731.408px',
          borderRadius: '30px',
          opacity: 1,
          padding: '3rem',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="space-y-6">
          {/* Registration Label */}
          <div className="inline-block mb-[35]">
            <span 
              className="text-white border border-white"
              style={{
                width: '299px',
                height: '57px',
                borderRadius: '10px',
                padding:'13px 22px 17px 22px',
                gap: '10px',
                border: '1px solid #fffff',
                fontFamily: 'Abolition Test, Arial Black, sans-serif',
                fontSize: '30px',
                letterSpacing: '10%',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {currentSlideData.label}
            </span>
          </div>

          {/* Main Heading */}
          <h2 
            className="text-white mb-[30]"
            style={{
              fontFamily: 'Abolition Test, Arial Black, sans-serif',
              fontWeight: 400,
              fontSize: '100px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: 'white'
            }}
          >
            {currentSlideData.title}
          </h2>

          {/* Event Details */}
          <div 
            className="text-white mb-[70] justify-center"
            style={{
              textAlign: 'center',
              display:'flex',
              alignItems:"center",
              gap:"20px"
            }}
          >
           <p className='heroPageDescription' style={{fontSize:23}}> {currentSlideData.date}</p>  <p style={{fontSize:35}}>|</p> <p className='heroPageDescription' style={{fontSize:23}}> 🇺🇸 {currentSlideData.location}</p>
          </div>

          {/* CTA Button */}
          {/* <div className="pt-6 mb-[147]">
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-10 py-4 font-semibold text-lg group transition-all duration-300 flex items-center gap-2 mx-auto">
              {currentSlideData.buttonText}
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div> */}
          <div className="flex justify-center pt-8 mb-[147]">
                        <button 
                          className="px-8 py-4 heroPageButton "
                          style={{fontSize:30,color:"#ffff" , background:"#CF3232"}}
                        >
                         <p className='heroSubtilepage' style={{fontSize:30}}> {currentSlideData.buttonText}</p>
                        {/* <Image src={images.heroPageBtnRightToggle} alt='' className='h-[30] w-[30] mt-[9]'/> */}
                        <div className='h-[30] w-[30] mt-[9] p-[2]' style={{border:"1.5px solid #ffff",borderRadius:7}}>
                            <ArrowRight />
                        </div>
                        </button>
                      </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 pt-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'bg-white w-16' : 'bg-white/30 w-8'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

     
    </section>
  );
};

export default EventCarousel;