import { MetadataRoute } from 'next'
import { WP_URL } from '@/lib/config'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/profile-verification',
          '/forgot-password',
          '/reset-password',
          '/api/',
        ],
      },
    ],
    sitemap: `${WP_URL}/sitemap.xml`,
  }
}
