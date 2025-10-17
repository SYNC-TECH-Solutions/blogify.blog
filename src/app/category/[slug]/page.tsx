"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { onSnapshot, query, where, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import BlogView from '@/components/blog/BlogView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import Header from '@/components/blog/Header';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { categories } from '@/lib/categories';

const postsCollectionPath = 'blog_posts';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const category = categories.find(cat => cat.toLowerCase().replace(/ /g, '-') === slug);

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore || !category) return;

    setLoading(true);
    const postsCollection = collection(firestore, postsCollectionPath);
    const q = query(
      postsCollection, 
      where('category', '==', category)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BlogPost));
      
      // Sort posts by date on the client side
      const sortedPosts = postsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate()?.getTime() || 0;
        const dateB = b.createdAt?.toDate()?.getTime() || 0;
        return dateB - dateA;
      });

      setPosts(sortedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching category posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, category]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12" />
          </div>
        ) : posts.length > 0 ? (
          <BlogView posts={posts} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-3xl font-bold text-muted-foreground">Coming Soon!</p>
              <p className="text-center text-muted-foreground mt-2">There are no posts in the "{category}" category yet. Check back later!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
