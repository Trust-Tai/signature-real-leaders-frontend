// import React, { useState, useEffect } from 'react';
// import { ArrowRight } from 'lucide-react';
// import Image from 'next/image';
// import { images } from '@/assets';

// const EventCarousel = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Carousel data - multiple variants
//   const slides = [
//     {
//       label: "REGISTRATION NOW OPEN",
//       title: "UNITE ORANGE COUNTY",
//       date: "February 10-12, 2027",
//       location: "Downtown San Diego, CA",
//       buttonText: "LEARN MORE"
//     },
//     {
//       label: "REGISTRATION NOW OPEN",
//       title: "UNITE SAN DIEGO",
//       date: "February 10-12, 2027", 
//       location: "Downtown San Diego, CA",
//       buttonText: "LEARN MORE"
//     },
//     {
//       label: "REGISTRATION NOW OPEN",
//       title: "UNITE AUSTIN",
//       date: "March 12, 2026",
//       location: "Austin, TX", 
//       buttonText: "LEARN MORE"
//     },
//     {
//       label: "REGISTRATION NOW OPEN",
//       title: "UNITE LOS ANGELES",
//       date: "February 10-12, 2027",
//       location: "Downtown San Diego, CA",
//       buttonText: "LEARN MORE"
//     },
//     {
//       label: "REGISTRATION NOW OPEN",
//       title: "BUILD YOUR NETWORK",
//       date: "February 10-12, 2027",
//       location: "Downtown San Diego, CA",
//       buttonText: "LEARN MORE"
//     }
//   ];

//   // Auto-change slides every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const currentSlideData = slides[currentSlide];

//   return (
//     <section className="relative h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Video/GIF - continuously playing */}
    
       
     
//         <div className="absolute inset-0 opacity-100">
//                <Image 
//                  src={images.eventPageGif}
//                  alt="Tech background animation"
//                  className="w-full h-full object-cover"
//                  style={{ 
//                    filter: 'blur(1px) brightness(0.7)'
//                  }}
//                />
//              </div>
    

//       {/* Content Card - matches your image exactly */}
//       <div 
//         className="relative z-10 text-center transition-all duration-800 transform"
//         style={{
//           animation: 'fadeIn 0.8s ease-out',
//           backdropFilter: 'blur(30px)',
//           border: 'none',
//           width: '777px',
//           height: '731.408px',
//           borderRadius: '30px',
//           opacity: 1,
//           padding: '3rem',
//           background: 'rgba(0, 0, 0, 0.3)',
//         }}
//       >
//         <div className="space-y-6">
//           {/* Registration Label */}
//           <div className="inline-block mb-[35]">
//             <span 
//               className="text-white border border-white"
//               style={{
//                 width: '299px',
//                 height: '57px',
//                 borderRadius: '10px',
//                 padding:'13px 22px 17px 22px',
//                 gap: '10px',
//                 border: '1px solid #fffff',
//                 fontFamily: 'Abolition Test, Arial Black, sans-serif',
//                 fontSize: '30px',
//                 letterSpacing: '10%',
//                 textAlign: 'center',
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               {currentSlideData.label}
//             </span>
//           </div>

//           {/* Main Heading */}
//           <h2 
//             className="text-white mb-[30]"
//             style={{
//               fontFamily: 'Abolition Test, Arial Black, sans-serif',
//               fontWeight: 400,
//               fontSize: '100px',
//               lineHeight: '100%',
//               letterSpacing: '0%',
//               textAlign: 'center',
//               color: 'white'
//             }}
//           >
//             {currentSlideData.title}
//           </h2>

//           {/* Event Details */}
//           <div 
//             className="text-white mb-[70] justify-center"
//             style={{
//               textAlign: 'center',
//               display:'flex',
//               alignItems:"center",
//               gap:"20px"
//             }}
//           >
//            <p className='heroPageDescription' style={{fontSize:23}}> {currentSlideData.date}</p>  <p style={{fontSize:35}}>|</p> <p className='heroPageDescription' style={{fontSize:23}}> 🇺🇸 {currentSlideData.location}</p>
//           </div>

//           {/* CTA Button */}
//           {/* <div className="pt-6 mb-[147]">
//             <button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-10 py-4 font-semibold text-lg group transition-all duration-300 flex items-center gap-2 mx-auto">
//               {currentSlideData.buttonText}
//               <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div> */}
//           <div className="flex justify-center pt-8 mb-[147]">
//                         <button 
//                           className="px-8 py-4 heroPageButton "
//                           style={{fontSize:30,color:"#ffff" , background:"#CF3232"}}
//                         >
//                          <p className='heroSubtilepage' style={{fontSize:30}}> {currentSlideData.buttonText}</p>
//                         {/* <Image src={images.heroPageBtnRightToggle} alt='' className='h-[30] w-[30] mt-[9]'/> */}
//                         <div className='h-[30] w-[30] mt-[9] p-[2]' style={{border:"1.5px solid #ffff",borderRadius:7}}>
//                             <ArrowRight />
//                         </div>
//                         </button>
//                       </div>

//           {/* Progress Indicators */}
//           <div className="flex justify-center gap-2 pt-8">
//             {slides.map((_, index) => (
//               <div
//                 key={index}
//                 className={`h-1 rounded-full transition-all duration-500 ${
//                   index === currentSlide ? 'bg-white w-16' : 'bg-white/30 w-8'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

     
//     </section>
//   );
// };

// export default EventCarousel;
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
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

      {/* Content Card - Responsive Design */}
      <div 
        className="relative z-10 text-center transition-all duration-800 transform w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl"
        style={{
          animation: 'fadeIn 0.8s ease-out',
          backdropFilter: 'blur(30px)',
          border: 'none',
          borderRadius: '20px',
          opacity: 1,
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Registration Label */}
          <div className="inline-block mb-4 sm:mb-6 md:mb-8 lg:mb-[35px]">
            <span 
              className="text-white border border-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4"
              style={{
                borderRadius: '8px',
                border: '1px solid #ffffff',
                fontFamily: 'Abolition Test, Arial Black, sans-serif',
                letterSpacing: '0.1em',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(12px, 3vw, 30px)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '90vw'
              }}
            >
              {currentSlideData.label}
            </span>
          </div>

          {/* Main Heading - Responsive Typography */}
          <h2 
            className="text-white mb-4 sm:mb-6 md:mb-8 lg:mb-[30px] leading-none"
            style={{
              fontFamily: 'Abolition Test, Arial Black, sans-serif',
              fontWeight: 400,
              lineHeight: '90%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: 'white',
              fontSize: 'clamp(32px, 8vw, 100px)',
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}
          >
            {currentSlideData.title}
          </h2>

          {/* Event Details - Responsive Layout */}
          <div className="text-white mb-6 sm:mb-8 md:mb-12 lg:mb-[70px] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6">
            <p 
              className="heroPageDescription text-center"
              style={{
                fontSize: 'clamp(16px, 3vw, 23px)',
                margin: 0
              }}
            > 
              {currentSlideData.date}
            </p>  
            <p 
              className="hidden sm:block"
              style={{
                fontSize: 'clamp(20px, 4vw, 35px)',
                margin: 0
              }}
            >
              |
            </p> 
            <p 
              className="heroPageDescription text-center"
              style={{
                fontSize: 'clamp(16px, 3vw, 23px)',
                margin: 0
              }}
            > 
              🇺🇸 {currentSlideData.location}
            </p>
          </div>

          {/* CTA Button - Responsive */}
          <div className="flex justify-center pt-4 sm:pt-6 md:pt-8 mb-8 sm:mb-12 md:mb-16 lg:mb-[147px]">
            <button 
              className="heroPageButton flex items-center gap-2 sm:gap-3 md:gap-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                color: "#ffffff", 
                background: "#CF3232",
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p 
                className='heroSubtilepage' 
                style={{
                  fontSize: 'clamp(16px, 3.5vw, 30px)',
                  margin: 0,
                  whiteSpace: 'nowrap'
                }}
              > 
                {currentSlideData.buttonText}
              </p>
              <div 
                className='flex items-center justify-center'
                style={{
                  width: 'clamp(20px, 4vw, 30px)',
                  height: 'clamp(20px, 4vw, 30px)',
                  border: "1.5px solid #ffffff",
                  borderRadius: '7px',
                  padding: '2px'
                }}
              >
                <ArrowRight style={{ width: '100%', height: '100%' }} />
              </div>
            </button>
          </div>

          {/* Progress Indicators - Responsive */}
          <div className="flex justify-center gap-1 sm:gap-2 pt-4 sm:pt-6 md:pt-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'bg-white w-8 sm:w-12 md:w-16' 
                    : 'bg-white/30 w-4 sm:w-6 md:w-8'
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