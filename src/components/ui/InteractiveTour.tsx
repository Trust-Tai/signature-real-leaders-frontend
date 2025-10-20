// "use client";

// import React, { useEffect, useRef, useState } from 'react';

// interface InteractiveTourProps {
//   isActive: boolean;
//   onComplete: () => void;
// }

// const InteractiveTour: React.FC<InteractiveTourProps> = ({ isActive, onComplete }) => {
//   const tourRef = useRef<any>(null);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (isActive && isClient) {
//       // Dynamically import TourGuideClient only on client side
//       import('@sjmc11/tourguidejs').then(({ TourGuideClient }) => {
//         // Initialize the tour
//         tourRef.current = new TourGuideClient({
//           backdrop: true,
//           backdropColor: 'rgba(0, 0, 0, 0.25)',
//           backdropBlur: '4px',
//           showProgress: true,
//           showButtons: true,
//           showStepNumbers: true,
//           keyboardControls: true,
//           exitOnEscape: true,
//           exitOnOverlayClick: false,
//           autoScroll: true,
//           autoScrollSmooth: true,
//           autoScrollOffset: 20,
//           highlightPadding: 12,
//           highlightBorderRadius: 12,
//           highlightAnimation: true,
//           highlightAnimationDuration: 300,
//           theme: {
//             primaryColor: '#CF3232',
//             textColor: '#1A202C',
//             backgroundColor: '#FFFFFF',
//             borderRadius: '24px',
//             boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
//             border: 'none',
//             fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif',
//             titleFontSize: '24px',
//             titleFontWeight: '700',
//             contentFontSize: '16px',
//             contentLineHeight: '1.7',
//             buttonBorderRadius: '16px',
//             buttonPadding: '16px 32px',
//             buttonFontWeight: '600',
//             progressBarColor: '#CF3232',
//             progressBarBackground: '#F7FAFC',
//             progressBarBorderRadius: '12px',
//             progressBarHeight: '6px',
//             stepNumberBackground: '#CF3232',
//             stepNumberColor: '#FFFFFF',
//             stepNumberBorderRadius: '50%',
//             stepNumberSize: '32px',
//             stepNumberFontWeight: '700',
//             tooltipArrowSize: '12px',
//             tooltipPadding: '32px',
//             tooltipMaxWidth: '480px',
//             tooltipMinWidth: '380px',
//             tooltipBorderRadius: '24px',
//             buttonBackground: '#CF3232',
//             buttonColor: '#FFFFFF',
//             buttonHoverBackground: '#B82A2A',
//             buttonSecondaryBackground: '#F8FAFC',
//             buttonSecondaryColor: '#4A5568',
//             buttonSecondaryBorder: '2px solid #E2E8F0',
//             buttonSecondaryHoverBackground: '#EDF2F7',
//             highlightColor: '#CF3232',
//             highlightOpacity: 0.1,
//           },
//           steps: [
//             {
//               title: "🎉 Welcome to Your Dashboard",
//               content: "Let's take a quick tour of your RealLeaders dashboard and show you what you can do. This will help you understand all the powerful features available to you.",
//               target: "[data-tour='dashboard-overview']",
//               placement: "bottom",
//               showSkipButton: true,
//             },
//             {
//               title: "📊 Performance Metrics",
//               content: "Here you can see your main performance metrics in real-time:\n• Bookings: Speaking engagements and consultations\n• Contacts: Email subscribers and leads\n• Page Views: Signature page traffic\n• Link Clicks: Engagement with your content",
//               target: "[data-tour='stats-cards']",
//               placement: "bottom",
//             },
//             {
//               title: "📅 Bookings This Month",
//               content: "Monitor your speaking engagements and consultations:\n• Track total scheduled appearances\n• View month-over-month growth\n• Never miss an important booking\n• Export booking data for planning",
//               target: "[data-tour='bookings-tab']",
//               placement: "right",
//             },
//             {
//               title: "📧 Newsletter Subscribers",
//               content: "Manage your email marketing and subscriber growth:\n• View subscriber count and growth trends\n• Track email engagement metrics\n• Export subscriber lists for campaigns\n• Analyze subscriber behavior patterns",
//               target: "[data-tour='newsletter-tab']",
//               placement: "right",
//             },
//             {
//               title: "👥 Followers",
//               content: "Track your social media and platform following:\n• Monitor follower growth across platforms\n• View engagement rates and interactions\n• Identify your most active audience segments\n• Compare performance across channels",
//               target: "[data-tour='followers-tab']",
//               placement: "right",
//             },
//             {
//               title: "👁️ Page Views",
//               content: "Analyze your signature page performance:\n• Track total page views and unique visitors\n• Monitor page performance over time\n• Identify peak traffic periods\n• Understand user behavior patterns",
//               target: "[data-tour='page-views-tab']",
//               placement: "right",
//             },
//             {
//               title: "🔗 Total Link Clicks",
//               content: "Measure engagement with your shared links:\n• Track clicks across all your shared links\n• Identify most popular content and resources\n• Optimize link placement for better engagement\n• Analyze click-through rates",
//               target: "[data-tour='link-clicks-tab']",
//               placement: "right",
//             },
//             {
//               title: "📈 Audience Demographics",
//               content: "Understand your audience composition and behavior:\n• View geographic distribution of your audience\n• Analyze age groups and professional roles\n• Track device usage and engagement patterns\n• Export demographic data for insights",
//               target: "[data-tour='demographics-tab']",
//               placement: "right",
//             },
//             {
//               title: "🎯 Tour Complete!",
//               content: "Congratulations! You're all set to explore your dashboard. You can now navigate through all the features and make the most of your RealLeaders platform. Click 'Start Tour' anytime to revisit this guide.",
//               target: "[data-tour='start-tour-button']",
//               placement: "bottom",
//             }
//           ]
//         });

//         // Add custom CSS for sidebar tab highlighting
//         const style = document.createElement('style');
//         style.textContent = `
//           /* General highlight styling */
//           .tourguide-highlight {
//             border: 3px solid #FFFFFF !important;
//             border-radius: 12px !important;
//             box-shadow: 0 0 0 2px #CF3232, 0 0 20px rgba(207, 50, 50, 0.3) !important;
//             background-color: rgba(255, 255, 255, 0.1) !important;
//             transition: all 0.3s ease !important;
//             position: relative !important;
//             z-index: 1000 !important;
//           }
          
//           /* Sidebar tab specific styling */
//           .tourguide-highlight[data-tour*="tab"],
//           .tourguide-highlight[data-tour="bookings-tab"],
//           .tourguide-highlight[data-tour="newsletter-tab"],
//           .tourguide-highlight[data-tour="followers-tab"],
//           .tourguide-highlight[data-tour="page-views-tab"],
//           .tourguide-highlight[data-tour="link-clicks-tab"],
//           .tourguide-highlight[data-tour="demographics-tab"] {
//             border: 4px solid #FFFFFF !important;
//             border-radius: 16px !important;
//             box-shadow: 0 0 0 3px #CF3232, 0 0 30px rgba(207, 50, 50, 0.5) !important;
//             background-color: rgba(255, 255, 255, 0.2) !important;
//             transform: scale(1.05) !important;
//             backdrop-filter: blur(2px) !important;
//           }
          
//           /* Force sidebar link styling */
//           aside .tourguide-highlight a,
//           aside .tourguide-highlight[data-tour*="tab"] {
//             border: 4px solid #FFFFFF !important;
//             border-radius: 16px !important;
//             box-shadow: 0 0 0 3px #CF3232, 0 0 30px rgba(207, 50, 50, 0.5) !important;
//             background-color: rgba(255, 255, 255, 0.2) !important;
//             transform: scale(1.05) !important;
//             padding: 8px !important;
//             margin: 4px !important;
//           }
          
//           /* Override any existing styles */
//           .tourguide-highlight * {
//             border: none !important;
//             box-shadow: none !important;
//           }
          
//           .tourguide-tooltip {
//             z-index: 9999 !important;
//           }
          
//           /* Ensure sidebar elements are properly highlighted */
//           [data-tour*="tab"].tourguide-highlight {
//             border: 4px solid #FFFFFF !important;
//             border-radius: 16px !important;
//             box-shadow: 0 0 0 3px #CF3232, 0 0 30px rgba(207, 50, 50, 0.5) !important;
//             background-color: rgba(255, 255, 255, 0.2) !important;
//             transform: scale(1.05) !important;
//           }
//         `;
//         document.head.appendChild(style);

//         // Start the tour
//         tourRef.current.start();
        
//         // Add additional styling after tour starts
//         setTimeout(() => {
//           const additionalStyle = document.createElement('style');
//           additionalStyle.textContent = `
//             /* Force highlight on sidebar elements */
//             .tourguide-highlight[data-tour*="tab"] {
//               border: 4px solid #FFFFFF !important;
//               border-radius: 16px !important;
//               box-shadow: 0 0 0 3px #CF3232, 0 0 30px rgba(207, 50, 50, 0.5) !important;
//               background-color: rgba(255, 255, 255, 0.2) !important;
//               transform: scale(1.05) !important;
//               position: relative !important;
//               z-index: 1001 !important;
//             }
            
//             /* Target sidebar specifically */
//             aside [data-tour*="tab"].tourguide-highlight {
//               border: 4px solid #FFFFFF !important;
//               border-radius: 16px !important;
//               box-shadow: 0 0 0 3px #CF3232, 0 0 30px rgba(207, 50, 50, 0.5) !important;
//               background-color: rgba(255, 255, 255, 0.2) !important;
//               transform: scale(1.05) !important;
//             }
//           `;
//           document.head.appendChild(additionalStyle);
//         }, 100);

//         // Handle tour completion
//         tourRef.current.on('complete', () => {
//           // Remove custom styles
//           document.head.removeChild(style);
//           onComplete();
//         });

//         // Handle tour exit
//         tourRef.current.on('exit', () => {
//           // Remove custom styles
//           document.head.removeChild(style);
//           onComplete();
//         });
//       }).catch((error) => {
//         console.error('Failed to load TourGuideJS:', error);
//       });
//     }

//     return () => {
//       if (tourRef.current) {
//         tourRef.current.exit();
//       }
//     };
//   }, [isActive, onComplete, isClient]);

//   // Don't render anything on server side
//   if (!isClient) {
//     return null;
//   }

//   return null; // This component doesn't render anything visible
// };

// export default InteractiveTour;

"use client";

import React, { useEffect, useRef, useState } from 'react';

interface InteractiveTourProps {
  isActive: boolean;
  onComplete: () => void;
}

type TourGuideEvents = 'complete' | 'exit' | 'start' | 'step';

interface TourGuideClientType {
  start: () => void;
  exit: () => void;
  on?: (event: TourGuideEvents, handler: () => void) => void;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ isActive, onComplete }) => {
  const tourRef = useRef<TourGuideClientType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Simple cleanup function without useCallback to prevent loops
  const cleanup = () => {
    if (tourRef.current) {
      try {
        tourRef.current.exit();
      } catch (error) {
        console.warn('Error during tour cleanup:', error);
      }
      tourRef.current = null;
    }
    
    // Reset states
    setIsInitialized(false);
    setIsStarting(false);
    
    // Remove custom styles
    const styleEl = document.getElementById('tour-guide-custom-styles');
    if (styleEl) {
      try {
        document.head.removeChild(styleEl);
      } catch (error) {
        console.warn('Error removing tour styles:', error);
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isActive || !isClient || isInitialized || isStarting) return;
    
    console.log('Tour initialization triggered', { isActive, isClient, isInitialized, isStarting });

    // Set starting state immediately to prevent multiple initializations
    setIsStarting(true);

    // Simple timeout-based initialization to prevent loops
    const timeoutId = setTimeout(() => {
      if (!isActive) {
        setIsStarting(false);
        return;
      }

      import('@sjmc11/tourguidejs')
        .then(({ TourGuideClient }) => {
          if (!isActive) {
            setIsStarting(false);
            return;
          }

          const options = {
            backdrop: true,
            backdropColor: 'rgba(0, 0, 0, 0.25)',
            backdropBlur: '4px',
            showProgress: true,
            showButtons: true,
            showStepNumbers: true,
            keyboardControls: true,
            exitOnEscape: true,
            exitOnOverlayClick: false,
            autoScroll: true,
            autoScrollSmooth: true,
            autoScrollOffset: 20,
            highlightPadding: 12,
            highlightBorderRadius: 12,
            highlightAnimation: true,
            highlightAnimationDuration: 300,
            theme: {
              primaryColor: '#CF3232',
              textColor: '#1A202C',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              border: 'none',
              fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, sans-serif',
              titleFontSize: '24px',
              titleFontWeight: '700',
              contentFontSize: '16px',
              contentLineHeight: '1.7',
              buttonBorderRadius: '16px',
              buttonPadding: '16px 32px',
              buttonFontWeight: '600',
              progressBarColor: '#CF3232',
              progressBarBackground: '#F7FAFC',
              progressBarBorderRadius: '12px',
              progressBarHeight: '6px',
              stepNumberBackground: '#CF3232',
              stepNumberColor: '#FFFFFF',
              stepNumberBorderRadius: '50%',
              stepNumberSize: '32px',
              stepNumberFontWeight: '700',
              tooltipArrowSize: '12px',
              tooltipPadding: '32px',
              tooltipMaxWidth: '480px',
              tooltipMinWidth: '380px',
              tooltipBorderRadius: '24px',
              buttonBackground: '#CF3232',
              buttonColor: '#FFFFFF',
              buttonHoverBackground: '#B82A2A',
              buttonSecondaryBackground: '#F8FAFC',
              buttonSecondaryColor: '#4A5568',
              buttonSecondaryBorder: '2px solid #E2E8F0',
              buttonSecondaryHoverBackground: '#EDF2F7',
              highlightColor: '#CF3232',
              highlightOpacity: 0.1,
            },
            steps: [
              {
                title: "🎉 Welcome to Your Dashboard",
                content: "Let's take a quick tour of your RealLeaders dashboard and show you what you can do. This will help you understand all the powerful features available to you.",
                target: "[data-tour='dashboard-overview']",
                placement: "bottom",
                showSkipButton: true,
              },
              {
                title: "📊 Performance Metrics",
                content: "Here you can see your main performance metrics in real-time:\n• Bookings: Speaking engagements and consultations\n• Contacts: Email subscribers and leads\n• Page Views: Signature page traffic\n• Link Clicks: Engagement with your content",
                target: "[data-tour='stats-cards']",
                placement: "bottom",
              },
              {
                title: "📅 Bookings This Month",
                content: "Monitor your speaking engagements and consultations:\n• Track total scheduled appearances\n• View month-over-month growth\n• Never miss an important booking\n• Export booking data for planning",
                target: "[data-tour='bookings-tab']",
                placement: "right",
              },
              {
                title: "📧 Newsletter Subscribers",
                content: "Manage your email marketing and subscriber growth:\n• View subscriber count and growth trends\n• Track email engagement metrics\n• Export subscriber lists for campaigns\n• Analyze subscriber behavior patterns",
                target: "[data-tour='newsletter-tab']",
                placement: "right",
              },
              {
                title: "👥 Followers",
                content: "Track your social media and platform following:\n• Monitor follower growth across platforms\n• View engagement rates and interactions\n• Identify your most active audience segments\n• Compare performance across channels",
                target: "[data-tour='followers-tab']",
                placement: "right",
              },
              {
                title: "👁️ Page Views",
                content: "Analyze your signature page performance:\n• Track total page views and unique visitors\n• Monitor page performance over time\n• Identify peak traffic periods\n• Understand user behavior patterns",
                target: "[data-tour='page-views-tab']",
                placement: "right",
              },
              {
                title: "🔗 Total Link Clicks",
                content: "Measure engagement with your shared links:\n• Track clicks across all your shared links\n• Identify most popular content and resources\n• Optimize link placement for better engagement\n• Analyze click-through rates",
                target: "[data-tour='link-clicks-tab']",
                placement: "right",
              },
              {
                title: "📈 Audience Demographics",
                content: "Understand your audience composition and behavior:\n• View geographic distribution of your audience\n• Analyze age groups and professional roles\n• Track device usage and engagement patterns\n• Export demographic data for insights",
                target: "[data-tour='demographics-tab']",
                placement: "right",
              },
              {
                title: "🎯 Tour Complete!",
                content: "Congratulations! You're all set to explore your dashboard. You can now navigate through all the features and make the most of your RealLeaders platform. Click 'Start Tour' anytime to revisit this guide.",
                target: "[data-tour='start-tour-button']",
                placement: "bottom",
              }
            ]
          };

          try {
            tourRef.current = new TourGuideClient(options);
            console.log('TourGuideClient initialized successfully');
          } catch (error) {
            console.error('Error initializing TourGuideClient:', error);
            setIsStarting(false);
            onComplete();
            return;
          }

          // Simplified CSS - only essential styles
          const style = document.createElement('style');
          style.id = 'tour-guide-custom-styles';
          style.textContent = `
            .tg-dialog, [class*="tourguide"] {
              z-index: 9999 !important;
            }
            .tg-highlight, .tourguide-highlight, [data-highlighted="true"] {
              outline: 4px solid #CF3232 !important;
              outline-offset: 4px !important;
              border-radius: 12px !important;
            }
          `;
          document.head.appendChild(style);

          setIsInitialized(true);
          
          // Start tour immediately
          setTimeout(() => {
            if (tourRef.current && isActive) {
              try {
                console.log('Starting tour...');
                tourRef.current.start();
                setIsStarting(false);
              } catch (error) {
                console.error('Error starting tour:', error);
                setIsStarting(false);
                onComplete();
              }
            } else {
              setIsStarting(false);
            }
          }, 100);

          // Handle tour completion
          tourRef.current.on?.('complete', () => {
            console.log('Tour completed successfully');
            cleanup();
            onComplete();
          });

          // Handle tour exit
          tourRef.current.on?.('exit', () => {
            console.log('Tour exited by user');
            cleanup();
            onComplete();
          });

          // Handle tour start
          tourRef.current.on?.('start', () => {
            console.log('Tour started successfully');
          });
        })
        .catch((error) => {
          console.error('Failed to load TourGuideJS:', error);
          setIsStarting(false);
          onComplete();
        });
    }, 500); // Single timeout, no loops

    return () => {
      clearTimeout(timeoutId);
      if (tourRef.current) {
        try {
          tourRef.current.exit();
        } catch (error) {
          console.warn('Error during tour cleanup:', error);
        }
        tourRef.current = null;
      }
    };
  }, [isActive, isClient, isInitialized, isStarting, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tourRef.current) {
        try {
          tourRef.current.exit();
        } catch (error) {
          console.warn('Error during tour cleanup:', error);
        }
        tourRef.current = null;
      }
      
      // Remove custom styles
      const styleEl = document.getElementById('tour-guide-custom-styles');
      if (styleEl) {
        try {
          document.head.removeChild(styleEl);
        } catch (error) {
          console.warn('Error removing tour styles:', error);
        }
      }
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return null;
};

export default InteractiveTour;