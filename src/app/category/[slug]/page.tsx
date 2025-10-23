
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { onSnapshot, query, where, collection, serverTimestamp } from 'firebase/firestore';
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const decodedSlug = slug ? decodeURIComponent(slug.replace(/%26/g, '&')) : '';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const category = categories.find(cat => cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === decodedSlug);

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore) return;
    
    if (!category) {
      setLoading(false);
      setPosts([]);
      return;
    }

    setLoading(true);
    const postsCollection = collection(firestore, postsCollectionPath);
    const q = query(
      postsCollection, 
      where('category', '==', category)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as BlogPost))
        .filter(post => post.isPublished) // Filter for published posts on the client
        .sort((a, b) => {
            if (a.updatedAt && b.updatedAt) {
                return b.updatedAt.toMillis() - a.updatedAt.toMillis();
            }
            return 0;
        }); // Sort by date on the client
      
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      const permissionError = new FirestorePermissionError({
        path: (q as any)._query.path.toString(),
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
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
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
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
              <p className="text-center text-muted-foreground mt-2">There are no posts in the "{category || decodedSlug}" category yet. Check back later!</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
