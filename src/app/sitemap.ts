import { MetadataRoute } from 'next'
import { WP_URL } from '@/lib/config'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = WP_URL
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add more static routes as needed
  ]
}
