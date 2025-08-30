// 'use client';

// import { useState, useEffect } from 'react';

// import Image from 'next/image';
// import { images } from '@/assets';
// import { useRouter } from "next/navigation";

// const HeroSection = () => {
//     const router = useRouter();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState({
//     days: 0,
//     hours: 9,
//     minutes: 34,
//     seconds: 0
//   });

//   const contentSlides = [
//     {
//       subtitle: "THE WORLD'S LEADERS",
//       title: "ONE PLATFORM",
//       description: "It's hard to find business leaders who believe they can solve the world's challenges.",
//       buttonText: "GET ACCESS"
//     },
//     {
     
//       subtitle: "BECOME THE AUTHORITY",
//       title: "IN YOUR INDUSTRY",
//       description: "Real Leaders core platform grants you access to the real leaders community and the digital tools to grow your impact.",
//       buttonText: "GET STARTED"
//     },
//     {
     
//       subtitle: "LEARN FROM EXPERIENCE",
//       title: "READ REAL LEADERS",
//       description: "Get direct insights from leaders who want to support your journey",
//       buttonText: "READ NOW"
//     },
//     {
     
//       subtitle: "MAKE YOUR MARK",
//       title: "SHARE YOUR SIGNATURE STORY",
//       description: "Get help with publishing your signature story that made you start your business and inspire leaders around the world.",
//       buttonText: "GET STARTED"
//     },
//     {
     
//       subtitle: "EMPOWER YOUR PEOPLE",
//       title: "TO BUILD THE BRAND",
//       description: "Turn Every Team Member Into a Trusted Voice",
//       buttonText: "GET ACCESS"
//     }
//   ];

//   // Auto-slide carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % contentSlides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [contentSlides.length]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev.seconds > 0) {
//           return { ...prev, seconds: prev.seconds - 1 };
//         } else if (prev.minutes > 0) {
//           return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
//         } else if (prev.hours > 0) {
//           return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
//         } else if (prev.days > 0) {
//           return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
//         }
//         return prev;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen relative overflow-hidden " style={{ backgroundColor: '#fff9f9', fontFamily: 'Outfit, sans-serif' }}>
//       <div className="absolute inset-0 opacity-30">
//         <Image 
//           src={images.heroPageGif}
//           alt="Tech background animation"
//           className="w-full h-full object-cover"
//           style={{ 
//             filter: 'blur(1px) brightness(0.7)'
//           }}
//         />
//       </div>

     
//       <div 
//         className="absolute inset-0" 
//         style={{
//           background: 'linear-gradient(270deg, rgba(207, 50, 50, 0) -15.77%, #CF3232 107.33%)'
//         }}
//       ></div>
      
//       <div className="relative z-10 h-screen flex flex-col items-start" style={{height:"100%"}}>
//         <div className="absolute top-6 left-6 z-50">
//           <button 
//             // onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="flex items-center gap-3 text-white group"
//             style={{ fontFamily: 'Abolition, sans-serif' }}
//           >
//             <Image src={images.sideToolBar} alt='' />
//             <Image src={images.realLeadersWhite} alt='' />
//           </button>
//         </div>

//         {sidebarOpen && (
//           <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
//             <div className="absolute left-0 top-0 h-full w-80 shadow-2xl transform transition-transform duration-300" style={{ backgroundColor: '#fff9f9' }}>
//               <div className="p-6 space-y-6">
//                 <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Abolition, sans-serif', color: '#CF3232' }}>RealLeaders</h2>
//                 <div className="space-y-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
//                   <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
//                     <h3 className="font-semibold text-gray-800">Featured Stories</h3>
//                     <p className="text-gray-600 text-sm">Explore inspiring journeys</p>
//                   </div>
//                   <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
//                     <h3 className="font-semibold text-gray-800">Community</h3>
//                     <p className="text-gray-600 text-sm">Connect with leaders</p>
//                   </div>
//                   <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
//                     <h3 className="font-semibold text-gray-800">Resources</h3>
//                     <p className="text-gray-600 text-sm">Tools and guides</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex-1 flex items-center justify-start items-start  relative px-6 w-[1538] h-[436] mt-[200] mr-[50] ml-[250]" style={{width:"-webkit-fill-available"}}>
//           <div className="text-center text-white space-y-8 ">
//             <div className="space-y-6">
//               <div className="h-8 flex items-center justify-start gap-[20]">
//                 <h2 
//                   className="heroSubtilepage"
//                 >
//                   {contentSlides[currentSlide].subtitle}
//                 </h2>
//                 <Image src={images.heroLine} alt='' className='mt-[10]'/>
//               </div>
              
//               <div className="flex items-center justify-start">
//                 <h1 
//                   className="heroTitlePage"
//                 >
//                 {contentSlides[currentSlide].title}
                    
//                 </h1>
//               </div>
//             </div>
            
//             <div className="h-16 flex items-center justify-start w-[594]">
//               <p 
//                 className="heroPageDescription text-start"
//               >
//                 {contentSlides[currentSlide].description}
//               </p>
//             </div>

//             <div className="flex justify-start pt-8">
//               <button 
//                 className="px-8 py-4 heroPageButton "
//                 style={{fontSize:30,color:"#CF3232"}}
//                 onClick={()=>router.push("/name-verification")}
//               >
//                <p className='heroSubtilepage' style={{fontSize:30}}> {contentSlides[currentSlide].buttonText}</p>
//               <Image src={images.heroPageBtnRightToggle} alt='' className='h-[30] w-[30] mt-[9]'/>
//               </button>
//             </div>
//           </div>

//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
//             {contentSlides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`w-1 h-12 rounded-full transition-all duration-500 hover:w-2 ${
//                   index === currentSlide 
//                     ? 'shadow-lg w-2' 
//                     : 'hover:bg-white/60'
//                 }`}
//                 style={{
//                   backgroundColor: index === currentSlide ? '#CF3232' : 'rgba(255, 255, 255, 0.4)'
//                 }}
//               />
//             ))}
//           </div>


          
//         </div>

     
//         <div className="text-white pb-8  mt-[190] ml-[50]">
//           <div className="flex flex-col lg:flex-row items-center justify-start gap-8 ml-[220]">
//             <h3 

//               className="heroSubtilepage"
//               style={{ fontSize:50 }}
//             >
//               EARLY REGISTRATION
//             </h3>
            
//          <div className="flex gap-6">
//   {[
//     { value: timeRemaining.days, label: "DAYS" },
//     { value: timeRemaining.hours, label: "HRS" },
//     { value: timeRemaining.minutes, label: "MIN" }
//   ].map((item, index) => (
//     <div key={index} className="flex gap-[20] items-center">
//       <div className="flex gap-2 justify-center">
//         {item.value.toString().padStart(2, "0").split("").map((digit, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-center w-[76px] h-[76px] rounded-[10px] border-[2px] border-[#efc0c0] backdrop-blur-[15px]"
//             style={{
//               backgroundColor: "rgba(255, 249, 249, 0.2)",
//             }}
//           >
//             <span
//               className="font-medium"
//               style={{
//                 fontFamily: "Outfit, sans-serif",
//                 fontSize: "50px",
//                 lineHeight: "100%",
//               }}
//             >
//               {digit}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div
//         className="heroSubtilepage" style={{fontSize:30}}
//       >
//         {item.label}
//       </div>
//     </div>
//   ))}
// </div>

            
            
//             <button 
//               className="px-8 py-4 heroPageButton"
//                style={{fontSize:30,color:"#CF3232"}}
               
//             >
//               <p className='heroSubtilepage' style={{fontSize:30}}>REGISTER NOW</p>
//             <Image src={images.heroPageBtnRightToggle} alt='' className='h-[30] w-[30] mt-[9]'/>
//             </button>
//           </div>
//         </div>
//       </div>



//     </div>
//   );
// };

// export default HeroSection;



'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import { images } from '@/assets';
import { useRouter } from "next/navigation";

const HeroSection = () => {
    const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
 

  const contentSlides = [
    {
      subtitle: "THE WORLD'S LEADERS",
      title: "ONE PLATFORM",
      description: "It's hard to find business leaders who believe they can solve the world's challenges.",
      buttonText: "GET VERIFIED"
    },
    {
     
      subtitle: "BECOME THE AUTHORITY",
      title: "IN YOUR INDUSTRY",
      description: "Real Leaders core platform grants you access to the real leaders community and the digital tools to grow your impact.",
      buttonText: "GET VERIFIED"
    },
    {
     
      subtitle: "LEARN FROM EXPERIENCE",
      title: "READ REAL LEADERS",
      description: "Get direct insights from leaders who want to support your journey",
      buttonText: "READ NOW"
    },
    {
     
      subtitle: "MAKE YOUR MARK",
      title: "SHARE YOUR SIGNATURE STORY",
      description: "Get help with publishing your signature story that made you start your business and inspire leaders around the world.",
      buttonText: "GET VERIFIED"
    },
    {
     
      subtitle: "EMPOWER YOUR PEOPLE",
      title: "TO BUILD THE BRAND",
      description: "Turn Every Team Member Into a Trusted Voice",
      buttonText: "GET VERIFIED"
    }
  ];

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % contentSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [contentSlides.length]);



  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fff9f9', fontFamily: 'Outfit, sans-serif' }}>
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <Image 
          src={images.heroPageGif}
          alt="Tech background animation"
          className="w-full h-full object-cover"
          style={{ 
            filter: 'blur(1px) brightness(0.7)'
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(270deg, rgba(207, 50, 50, 0) -15.77%, #CF3232 107.33%)'
        }}
      ></div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="absolute top-6 left-6 z-50">
          <button 
            className="flex items-center gap-3 text-white group"
            style={{ fontFamily: 'Abolition, sans-serif' }}
          >
            <Image src={images.sideToolBar} alt='' />
            <Image src={images.realLeadersWhite} alt='' />
          </button>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-80 shadow-2xl transform transition-transform duration-300" style={{ backgroundColor: '#fff9f9' }}>
              <div className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Abolition, sans-serif', color: '#CF3232' }}>RealLeaders</h2>
                <div className="space-y-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                    <h3 className="font-semibold text-gray-800">Featured Stories</h3>
                    <p className="text-gray-600 text-sm">Explore inspiring journeys</p>
                  </div>
                  <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                    <h3 className="font-semibold text-gray-800">Community</h3>
                    <p className="text-gray-600 text-sm">Connect with leaders</p>
                  </div>
                  <div className="p-4 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                    <h3 className="font-semibold text-gray-800">Resources</h3>
                    <p className="text-gray-600 text-sm">Tools and guides</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-start px-6 lg:ml-[250px] lg:mt-[100px]">
          <div className="text-white w-full lg:w-auto">
            {/* Content Stack for Mobile/Tablet, Side by Side for Desktop */}
            <div className="lg:flex lg:items-center lg:justify-between lg:w-full">
              {/* Text Content */}
              <div className="lg:flex-1 space-y-4 lg:space-y-8">
                {/* 1. Subtitle */}
                <div className="flex items-center justify-start gap-5">
                  <h2 className="heroSubtilepage">
                    {contentSlides[currentSlide].subtitle}
                  </h2>
                  <Image src={images.heroLine} alt='' className='mt-2 hidden lg:block'/>
                </div>
                
                {/* 2. Title */}
                <div className="flex items-center justify-start">
                  <h1 className="heroTitlePage lg:text-base" style={{fontSize: 'clamp(4rem, 7vw, 999px)'}}>
                    {contentSlides[currentSlide].title}
                  </h1>
                </div>
                
                {/* 3. Description */}
                <div className="w-full lg:w-[594px]">
                  <p className="heroPageDescription text-start">
                    {contentSlides[currentSlide].description}
                  </p>
                </div>

                {/* 4. Button */}
                <div className="pt-4 lg:pt-8">
                  <button 
                    className="px-4 py-2 lg:px-8 lg:py-4 heroPageButton flex items-center gap-2 lg:gap-3"
                    style={{fontSize:30, color:"#CF3232"}}
                    onClick={()=>router.push("/name-verification")}
                  >
                    <p className='heroSubtilepage text-sm lg:text-3xl' style={{fontSize:30}}>{contentSlides[currentSlide].buttonText}</p>
                    <Image src={images.heroPageBtnRightToggle} alt='' className='h-5 w-5 lg:h-[30px] lg:w-[30px] mt-1 lg:mt-[9px]'/>
                  </button>
                </div>

                {/* 5. Carousel Indicators - Mobile/Tablet View */}
                <div className="flex justify-center space-x-3 pt-6 lg:hidden">
                  {contentSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-8 h-1 lg:w-12 lg:h-1 rounded-full transition-all duration-500 ${
                        index === currentSlide 
                          ? 'shadow-lg' 
                          : 'hover:bg-white/60'
                      }`}
                      style={{
                        backgroundColor: index === currentSlide ? '#CF3232' : 'rgba(255, 255, 255, 0.4)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Indicators - Desktop View */}
              <div className="hidden lg:flex absolute right-6 top-1/2 transform -translate-y-1/2 flex-col space-y-4">
                {contentSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1 h-12 rounded-full transition-all duration-500 hover:w-2 ${
                      index === currentSlide 
                        ? 'shadow-lg w-2' 
                        : 'hover:bg-white/60'
                    }`}
                    style={{
                      backgroundColor: index === currentSlide ? '#CF3232' : 'rgba(255, 255, 255, 0.4)'
                    }}
                  />
                ))}
              </div>
            </div>

            

          </div>
        </div>

       
       
</div>
      </div>
    
  );
};

export default HeroSection;