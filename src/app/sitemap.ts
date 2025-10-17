import { MetadataRoute } from 'next'
import { categories } from '@/lib/categories';
 
const URL = 'https://blogify.blog';

export default function sitemap(): MetadataRoute.Sitemap {
  
  const staticPages = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
     {
      url: `${URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ] satisfies MetadataRoute.Sitemap;

  const categoryPages = categories.map((category) => ({
    url: `${URL}/category/${category.toLowerCase().replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) satisfies MetadataRoute.Sitemap;

  return [
    ...staticPages,
    ...categoryPages,
  ];
}
