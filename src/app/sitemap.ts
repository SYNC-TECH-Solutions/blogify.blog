
import { MetadataRoute } from 'next'
import { categories } from '@/lib/categories';
import { initializeFirebase } from '@/firebase/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
 
const URL = 'https://blogify.blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
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
    {
      url: `${URL}/subscriptions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ] satisfies MetadataRoute.Sitemap;

  const categoryPages = categories.map((category) => ({
    url: `${URL}/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) satisfies MetadataRoute.Sitemap;

  let blogPostPages: MetadataRoute.Sitemap = [];
  try {
    const { firestore } = initializeFirebase();
    const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;
    const q = query(collection(firestore, postsCollectionPath), where('isPublished', '==', true));
    const querySnapshot = await getDocs(q);
    blogPostPages = querySnapshot.docs.map(doc => ({
      url: `${URL}/blog/${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate() || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    }));
  } catch (e) {
    console.error("Could not generate sitemap for blog posts", e);
  }


  return [
    ...staticPages,
    ...categoryPages,
    ...blogPostPages
  ];
}

