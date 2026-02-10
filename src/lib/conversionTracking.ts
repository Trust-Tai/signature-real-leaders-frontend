/**
 * Conversion tracking utilities for profile verification completion
 */

// Get tracking IDs from environment variables
const GA4_MEASUREMENT_ID = "G-FE3YQDLD7N";
const GOOGLE_ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Fire conversion event when profile verification is completed
 * This tracks the "success" event for GA4 and Google Ads conversion tracking
 */
export const trackProfileVerificationSuccess = () => {
  try {
  

    // Track via Google Tag Manager dataLayer (Primary method - works with your GTM-TT86VCLZ)
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'profile_application_completed',
        event_category: 'profile_verification',
        event_label: 'verification_completed',
        value: 1,
        currency: 'USD',
        conversion: true,
        custom_parameters: {
          verification_step: 'final_completion',
          completion_timestamp: new Date().toISOString(),
          page_path: '/profile-verification',
          gtm_id: GTM_ID
        }
      });
      
      console.log('[Conversion Tracking] ✅ Profile verification success event pushed to dataLayer for GTM:', GTM_ID);
    }
  console.log("window.gtag",window.gtag,"GA4_MEASUREMENT_ID",GA4_MEASUREMENT_ID)
    // Track via gtag (GA4) if GA4 ID is configured
    if (typeof window !== 'undefined' && GA4_MEASUREMENT_ID) {
      // Wait for gtag to be available
      const waitForGtag = () => {
        if (window.gtag) {
          // Primary conversion event
          console.log("✅ gtag available, firing GA4 event");
          window.gtag('event', 'profile_application_completed', {
            send_to: GA4_MEASUREMENT_ID,
            event_category: 'profile_verification',
            event_label: 'verification_completed',
            value: 1,
            currency: 'USD',
            custom_parameters: {
              verification_step: 'final_completion',
              completion_timestamp: new Date().toISOString(),
              page_path: '/profile-verification'
            }
          });

          console.log('[Conversion Tracking] ✅ Profile verification success event sent to GA4:', GA4_MEASUREMENT_ID);
        } else {
          console.log('[Conversion Tracking] ⚠️ gtag not available yet, retrying in 500ms...');
          setTimeout(waitForGtag, 500);
        }
      };
      
      // Start checking for gtag
      waitForGtag();
    } else if (!GA4_MEASUREMENT_ID) {
      console.log('[Conversion Tracking] ⚠️ GA4_MEASUREMENT_ID not configured, skipping direct GA4 tracking');
    }

    // Track Google Ads conversion if configured
    if (typeof window !== 'undefined' && window.gtag && GOOGLE_ADS_CONVERSION_ID) {
      window.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_CONVERSION_ID,
        event_category: 'profile_verification',
        event_label: 'profile_verification_completed',
        value: 1,
        currency: 'USD'
      });

      console.log('[Conversion Tracking] ✅ Google Ads conversion event sent:', GOOGLE_ADS_CONVERSION_ID);
    } else if (!GOOGLE_ADS_CONVERSION_ID) {
      console.log('[Conversion Tracking] ⚠️ GOOGLE_ADS_CONVERSION_ID not configured, skipping Google Ads tracking');
    }

    // Additional events for flexibility (via GTM dataLayer)
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Alternative event names for different tracking needs
      window.dataLayer.push({
        event: 'verification_started', // For tracking verification process completion
        event_category: 'profile_verification',
        event_label: 'process_completed'
      });

      window.dataLayer.push({
        event: 'submit_application_success', // Alternative event name
        event_category: 'profile_verification',
        event_label: 'application_submitted'
      });

      console.log('[Conversion Tracking] ✅ Additional tracking events pushed to dataLayer');
    }

  } catch (error) {
    console.error('[Conversion Tracking] ❌ Error tracking profile verification success:', error);
  }
};

/**
 * Track when user starts the profile verification process
 */
export const trackProfileVerificationStart = () => {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'profile_verification_started',
        event_category: 'profile_verification',
        event_label: 'verification_process_started',
        custom_parameters: {
          start_timestamp: new Date().toISOString(),
          page_path: '/profile-verification',
          gtm_id: GTM_ID
        }
      });
    }

    if (typeof window !== 'undefined' && GA4_MEASUREMENT_ID) {
      const waitForGtag = () => {
        if (window.gtag) {
          window.gtag('event', 'profile_verification_started', {
            send_to: GA4_MEASUREMENT_ID,
            event_category: 'profile_verification',
            event_label: 'verification_process_started'
          });
          console.log('[Conversion Tracking] ✅ Profile verification start event sent to GA4');
        } else {
          setTimeout(waitForGtag, 500);
        }
      };
      waitForGtag();
    }

    console.log('[Conversion Tracking] ✅ Profile verification start event tracked');
  } catch (error) {
    console.error('[Conversion Tracking] ❌ Error tracking profile verification start:', error);
  }
};