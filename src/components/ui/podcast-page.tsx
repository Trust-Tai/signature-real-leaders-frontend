// import * as React from "react"
// import { Play } from 'lucide-react';
// import { images } from "@/assets";
// import Image from "next/image";

// const cn = (...classes: Array<string | number | false | null | undefined>) =>
//   classes.filter((c): c is string | number => Boolean(c)).join(' ');

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
//   size?: 'default' | 'sm' | 'lg' | 'icon';
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant = 'default', size = 'default', ...props }, ref) => {
//     const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
//     const variantClasses = {
//       default: "bg-blue-600 text-white hover:bg-blue-700",
//       destructive: "bg-red-600 text-white hover:bg-red-700",
//       outline: "border border-gray-300 bg-transparent hover:bg-gray-100 hover:text-gray-900",
//       secondary: "bg-white text-blue-600 hover:bg-gray-50 font-semibold",
//       ghost: "hover:bg-gray-100 hover:text-gray-900",
//       link: "text-blue-600 underline-offset-4 hover:underline",
//     };
    
//     const sizeClasses = {
//       default: "h-10 px-4 py-2",
//       sm: "h-9 rounded-md px-3",
//       lg: "h-11 rounded-md px-8",
//       icon: "h-10 w-10",
//     };
    
//     return (
//       <button
//         className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );

// Button.displayName = "Button"

// const PodcastSection = () => {
//   const podcasts = [
//     {
//       id: 1,
//       title: "Temperament: Money, Mind & Emotions",
//       category: "PERSONAL FINANCE",
//       duration: "5:30",
//       thumbnail: images.h1First,
//       bgColor: "bg-slate-800",
//     },
//     {
//       id: 2,
//       title: "Time Management Hacks: How To Be More Productive",
//       category: "GROWTH", 
//       duration: "23:10",
//       thumbnail: images.h1Second,
//       bgColor: "bg-amber-500",
//     },
//     {
//       id: 3,
//       title: "How to Improve Your Work-Life Balance",
//       category: "WORK/LIFE",
//       duration: "21:00",
//       thumbnail: images.h1Third,
//       bgColor: "bg-gray-900",
//     },
//     {
//       id: 4,
//       title: "How To Plan and Set Goals With Purpose for Wor....",
//       category: "READY, SET, GOAL",
//       duration: "18:00",
//       thumbnail: images.h1Fourth,
//       bgColor: "bg-blue-100",
//     },
//     {
//       id: 5,
//       title: "The ONLY 7 Step Goal Setting Method You Need to Become..",
//       category: "READY, SET, GOAL",
//       duration: "35:00",
//       thumbnail: images.h1Fifth,
//       bgColor: "bg-teal-700",
//     },
//     {
//       id: 6,
//       title: "10-minute Meditation Break",
//       category: "DAILY WELLNESS",
//       duration: "10:00",
//       thumbnail: images.h1Sixth,
//       bgColor: "bg-sky-400",
//     },
//   ];

  

//   return (
//     <div className="min-h-screen py-20" style={{backgroundColor: '#f9efef'}}>
//       <div className="container mx-auto px-6">
//         <div className="grid lg:grid-cols-12 gap-16 items-start">
//           {/* Left Content */}
//           <div className="lg:col-span-4 space-y-6">
//             <h2 className="heroSubtilepage mb-[35]" style={{fontSize:80,color:"#333333"}}>
//               PODCASTS
//             </h2>
//             <p className="font-outift font-medium text-[#333333B2] mb-[45]" style={{ fontSize: '18px', lineHeight: '26px'}}>
//               The Real Leaders Podcast provides real, fresh, and inspiring experiences 
//               from the world&apos;s most forward-thinking impact business CEOs, leadership 
//               authors, and thought leaders. Each episode will leave you with a page-full 
//               of notes on how to lead the future of work.
//             </p>
//             <Button 
//               size="lg"
//               className="bg-[#CF3232] firstVerifyScreenButton text-white text-sm tracking-wider uppercase"
//               style={{
//                 width: '233px',
//                 height: '64px',
//                 borderRadius: '5px',
//                 paddingTop: '22px',
//                 paddingRight: '80px',
//                 paddingBottom: '22px',
//                 paddingLeft: '80px',
//                  fontFamily: "Abolition Test",
//                  fontSize:26
//               }}
//             >
//               SUBSCRIBE
//             </Button>
//           </div>

//           {/* Right Podcast Grid */}
//           <div className="lg:col-span-8 ml-[121]">
//             <div className="grid grid-cols-3 gap-[50]">
//               {podcasts.map((podcast) => (
//                 <div
//                   key={podcast.id}
//                   className="group flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//                   style={{width: '220px', height: '354px', background:"#f9efef"}}
//                 >
//                   {/* Image Section */}
//                   <div className="relative overflow-hidden" style={{width: '220px', height: '220px'}}>
//                     <Image
//                       src={podcast.thumbnail}
//                       alt={podcast.title}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black/20"></div>
//                   </div>
                  
//                   {/* Content Section - Flexible height */}
//                   <div className="flex flex-col flex-1 justify-between mt-[15]">
//                     {/* Top Content */}
//                     <div>
//                       <span className='text-[#333333] font-outift block mb-[6]' style={{fontSize:11}}>
//                         {podcast.category}
//                       </span>
//                       <h3 className="font-outift text-[#333333]" style={{fontSize:16}}>
//                         {podcast.title}
//                       </h3>
//                     </div>
                    
//                     {/* Button at Bottom */}
//                     <div className="mt-auto pt-2">
//                       <Button 
//                         size="sm"
//                         className="font-outift text-[#333333] rounded-lg"
//                         style={{height: '32px', fontSize: '10px', background:"#f9efef", color:"black", border: "1px solid #828282"}}
//                       >
//                         <Play className="h-3 w-3 mr-1" />
//                         WATCH  {podcast.duration}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       </div>
//     );
//   };

// export default PodcastSection;


import * as React from "react"
import { Play } from 'lucide-react';
import { images } from "@/assets";
import Image from "next/image";

const cn = (...classes: Array<string | number | false | null | undefined>) =>
  classes.filter((c): c is string | number => Boolean(c)).join(' ');

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-100 hover:text-gray-900",
      secondary: "bg-white text-blue-600 hover:bg-gray-50 font-semibold",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };
    
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    
    return (
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"

const PodcastSection = () => {
  const podcasts = [
    {
      id: 1,
      title: "Temperament: Money, Mind & Emotions",
      category: "PERSONAL FINANCE",
      duration: "5:30",
      thumbnail: images.h1First,
      bgColor: "bg-slate-800",
    },
    {
      id: 2,
      title: "Time Management Hacks: How To Be More Productive",
      category: "GROWTH", 
      duration: "23:10",
      thumbnail: images.h1Second,
      bgColor: "bg-amber-500",
    },
    {
      id: 3,
      title: "How to Improve Your Work-Life Balance",
      category: "WORK/LIFE",
      duration: "21:00",
      thumbnail: images.h1Third,
      bgColor: "bg-gray-900",
    },
    {
      id: 4,
      title: "How To Plan and Set Goals With Purpose for Wor....",
      category: "READY, SET, GOAL",
      duration: "18:00",
      thumbnail: images.h1Fourth,
      bgColor: "bg-blue-100",
    },
    {
      id: 5,
      title: "The ONLY 7 Step Goal Setting Method You Need to Become..",
      category: "READY, SET, GOAL",
      duration: "35:00",
      thumbnail: images.h1Fifth,
      bgColor: "bg-teal-700",
    },
    {
      id: 6,
      title: "10-minute Meditation Break",
      category: "DAILY WELLNESS",
      duration: "10:00",
      thumbnail: images.h1Sixth,
      bgColor: "bg-sky-400",
    },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16 lg:py-20" style={{backgroundColor: '#f9efef'}}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h2 
              className="heroSubtilepage font-bold leading-none"
              style={{
                fontSize: 'clamp(40px, 8vw, 80px)',
                color: "#333333"
              }}
            >
              PODCASTS
            </h2>
            <p 
              className="font-outfit font-medium text-[#333333B2] max-w-md mx-auto lg:mx-0"
              style={{ 
                fontSize: 'clamp(16px, 2vw, 18px)', 
                lineHeight: '1.5'
              }}
            >
              The Real Leaders Podcast provides real, fresh, and inspiring experiences 
              from the world&apos;s most forward-thinking impact business CEOs, leadership 
              authors, and thought leaders. Each episode will leave you with a page-full 
              of notes on how to lead the future of work.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-[#CF3232] firstVerifyScreenButton text-white tracking-wider uppercase font-bold"
                style={{
                  width: 'clamp(180px, 40vw, 233px)',
                  height: 'clamp(48px, 8vw, 64px)',
                  borderRadius: '5px',
                  fontFamily: "Abolition Test",
                  fontSize: 'clamp(16px, 3vw, 26px)'
                }}
              >
                SUBSCRIBE
              </Button>
            </div>
          </div>

          {/* Right Podcast Grid */}
          <div className="lg:col-span-8 lg:ml-8 xl:ml-16 2xl:ml-[121px]">
            {/* Mobile: Single column, Tablet: 2 columns, Desktop: 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-[50px] place-items-center">
              {podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="group flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-[280px] sm:max-w-none"
                  style={{
                    width: 'clamp(250px, 100%, 220px)', 
                    height: 'auto',
                    minHeight: 'clamp(320px, 60vw, 354px)',
                    background: "#f9efef"
                  }}
                >
                  {/* Image Section */}
                  <div 
                    className="relative overflow-hidden w-full aspect-square"
                    style={{
                      maxHeight: 'clamp(250px, 40vw, 220px)'
                    }}
                  >
                    <Image
                      src={podcast.thumbnail}
                      alt={podcast.title}
                      className="w-full h-full object-cover"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex flex-col flex-1 justify-between p-3 sm:p-4 lg:p-0 lg:mt-[15px]">
                    {/* Top Content */}
                    <div className="mb-3 sm:mb-4">
                      <span 
                        className='text-[#333333] font-outfit block mb-2'
                        style={{fontSize: 'clamp(10px, 2vw, 11px)'}}
                      >
                        {podcast.category}
                      </span>
                      <h3 
                        className="font-outfit text-[#333333] leading-tight"
                        style={{fontSize: 'clamp(14px, 3vw, 16px)'}}
                      >
                        {podcast.title}
                      </h3>
                    </div>
                    
                    {/* Button at Bottom */}
                    <div className="mt-auto">
                      <Button 
                        size="sm"
                        className="font-outfit text-[#333333] rounded-lg w-full sm:w-auto"
                        style={{
                          height: 'clamp(28px, 6vw, 32px)', 
                          fontSize: 'clamp(9px, 2vw, 10px)', 
                          background: "#f9efef", 
                          color: "black", 
                          border: "1px solid #828282"
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        WATCH {podcast.duration}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastSection;