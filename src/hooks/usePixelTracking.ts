import { useEffect } from 'react';

interface PixelData {
  tracking_enabled: boolean;
  facebook: Array<{
    pixel_id: string;
    source: string;
    enabled: boolean;
  }>;
  google_ads: Array<{
    conversion_id: string;
    source: string;
    enabled: boolean;
  }>;
}

export type { PixelData };

interface ProfileData {
  user_id: number;
  username: string;
  full_name: string;
}

export const usePixelTracking = (profileData: ProfileData | null, pixels: PixelData | undefined) => {
  useEffect(() => {
    // Early return if no profile data
    if (!profileData) {
      console.log('[Pixel Debug] No profile data available');
      return;
    }

    // Early return if no pixels configuration
    if (!pixels) {
      console.log('[Pixel Debug] No pixels configuration available');
      return;
    }

    // Early return if tracking is disabled
    if (!pixels.tracking_enabled) {
      console.log('[Pixel Debug] Pixel tracking is disabled');
      return;
    }



    // Load Facebook Pixel
    if (pixels.facebook && pixels.facebook.length > 0) {
      pixels.facebook.forEach((pixel) => {
        if (pixel.enabled) {
          loadFacebookPixel(pixel.pixel_id, profileData);
        } else {
          console.log(`[Pixel Debug] Facebook pixel ${pixel.pixel_id} is disabled`);
        }
      });
    } else {
      console.log('[Pixel Debug] No Facebook pixels configured');
    }

    // Load Google Ads
    if (pixels.google_ads && pixels.google_ads.length > 0) {
      pixels.google_ads.forEach((ads) => {
        if (ads.enabled) {
          loadGoogleAds(ads.conversion_id, profileData);
        } else {
          console.log(`[Pixel Debug] Google Ads ${ads.conversion_id} is disabled`);
        }
      });
    } else {
      console.log('[Pixel Debug] No Google Ads pixels configured');
    }
  }, [profileData, pixels]);
};

const loadFacebookPixel = (pixelId: string, profileData: ProfileData) => {
  
  // Check if Facebook Pixel is already loaded
  if (typeof window !== 'undefined' && (window as { fbq?: unknown }).fbq) {
    // Facebook Pixel already loaded, just track the event
    trackFacebookEvent(pixelId, profileData);
    return;
  }

  // Load Facebook Pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
    console.log('[Pixel Debug] Facebook Pixel initialized and PageView tracked');
  `;
  document.head.appendChild(script);

  // Track profile view event
  setTimeout(() => {
    trackFacebookEvent(pixelId, profileData);
  }, 1000);
};

const trackFacebookEvent = (pixelId: string, profileData: ProfileData) => {
  if (typeof window !== 'undefined' && (window as { fbq?: (action: string, event: string, data?: unknown) => void }).fbq) {
    const eventData = {
      content_type: 'profile',
      content_ids: [`user_${profileData.user_id}`],
      content_name: profileData.full_name || profileData.username,
      content_category: 'profile_view',
      value: 1,
      currency: 'USD',
      custom_parameter: {
        profile_username: profileData.username,
        profile_id: profileData.user_id,
        profile_name: profileData.full_name || profileData.username,
        view_source: 'profile_page'
      }
    };
    
    
    (window as unknown as { fbq: (action: string, event: string, data?: unknown) => void }).fbq('track', 'ViewContent', eventData);
    
    // Also track as custom profile view event
    (window as unknown as { fbq: (action: string, event: string, data?: unknown) => void }).fbq('trackCustom', 'ProfileView', eventData);
  } else {
    console.log(`[Pixel Debug] Facebook Pixel not available for tracking`);
  }
};

const loadGoogleAds = (conversionId: string, profileData: ProfileData) => {

  
  // Check if Google Ads is already loaded
  if (typeof window !== 'undefined' && (window as { gtag?: unknown }).gtag) {
    // Google Ads already loaded, just track the event
    trackGoogleAdsEvent(conversionId, profileData);
    return;
  }

  // Load Google Ads script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize Google Ads
  const initScript = document.createElement('script');
  initScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${conversionId}');
    console.log('[Pixel Debug] Google Ads initialized');
  `;
  document.head.appendChild(initScript);

  // Track profile view event
  setTimeout(() => {
    trackGoogleAdsEvent(conversionId, profileData);
  }, 1000);
};

const trackGoogleAdsEvent = (conversionId: string, profileData: ProfileData) => {
  if (typeof window !== 'undefined' && (window as { gtag?: (command: string, action: string, parameters?: unknown) => void }).gtag) {
    const eventData = {
      send_to: conversionId,
      event_category: 'profile_engagement',
      event_label: `Profile View - ${profileData.username}`,
      value: 1,
      currency: 'USD',
      custom_parameter: {
        profile_username: profileData.username,
        profile_id: profileData.user_id,
        profile_name: profileData.full_name || profileData.username,
        view_source: 'profile_page'
      }
    };
    
    (window as unknown as { gtag: (command: string, action: string, parameters?: unknown) => void }).gtag('event', 'page_view', eventData);
    
    // Also track as custom profile view event
    (window as unknown as { gtag: (command: string, action: string, parameters?: unknown) => void }).gtag('event', 'profile_view', {
      event_category: 'profile_engagement',
      event_label: profileData.username,
      value: 1,
      custom_parameters: eventData.custom_parameter
    });
  } else {
    console.log(`[Pixel Debug] Google Ads not available for tracking`);
  }
};

// Function to track link clicks (can be called from templates)
export const trackPixelLinkClick = (profileData: ProfileData | null, pixels: PixelData | undefined, linkName: string, linkUrl: string) => {
  if (!profileData || !pixels || !pixels.tracking_enabled) {
    console.log('[Pixel Debug] Link click tracking not enabled or no data available');
    return;
  }


  // Track Facebook Pixel link click
  if (pixels.facebook && pixels.facebook.length > 0) {
    pixels.facebook.forEach((pixel) => {
      if (pixel.enabled && typeof window !== 'undefined' && (window as { fbq?: (action: string, event: string, data?: unknown) => void }).fbq) {
        const eventData = {
          content_type: 'link_click',
          content_name: linkName,
          content_category: 'profile_link',
          value: 1, // Assign value of 1 for each link click
          currency: 'USD',
          custom_parameter: {
            profile_username: profileData.username,
            profile_id: profileData.user_id,
            profile_name: profileData.full_name || profileData.username,
            link_name: linkName,
            link_url: linkUrl,
            click_source: 'profile_page'
          }
        };
        
        // Track as Lead event (good for conversion tracking)
        (window as unknown as { fbq: (action: string, event: string, data?: unknown) => void }).fbq('track', 'Lead', eventData);
        
        // Also track as custom event for more detailed analytics
        (window as unknown as { fbq: (action: string, event: string, data?: unknown) => void }).fbq('trackCustom', 'ProfileLinkClick', eventData);
      }
    });
  }

  // Track Google Ads link click
  if (pixels.google_ads && pixels.google_ads.length > 0) {
    pixels.google_ads.forEach((ads) => {
      if (ads.enabled && typeof window !== 'undefined' && (window as { gtag?: (command: string, action: string, parameters?: unknown) => void }).gtag) {
        const eventData = {
          send_to: ads.conversion_id,
          event_category: 'profile_engagement',
          event_label: `${linkName} - ${linkUrl}`,
          value: 1,
          currency: 'USD',
          custom_parameter: {
            profile_username: profileData.username,
            profile_id: profileData.user_id,
            profile_name: profileData.full_name || profileData.username,
            link_name: linkName,
            link_url: linkUrl,
            click_source: 'profile_page'
          }
        };
        
        // Track as conversion event
        (window as unknown as { gtag: (command: string, action: string, parameters?: unknown) => void }).gtag('event', 'conversion', eventData);
        
        // Also track as custom click event
        (window as unknown as { gtag: (command: string, action: string, parameters?: unknown) => void }).gtag('event', 'link_click', {
          event_category: 'profile_engagement',
          event_label: linkName,
          value: linkUrl,
          custom_parameters: eventData.custom_parameter
        });
      }
    });
  }
};