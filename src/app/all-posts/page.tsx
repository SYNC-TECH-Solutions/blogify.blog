
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import BlogView from '@/components/blog/BlogView';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Loader } from '@/components/ui/loader';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function AllPostsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore) return;
    setLoading(true);

    const postsCollection = collection(firestore, postsCollectionPath);
    // Query for all posts, ordered by creation date
    const q = query(
      postsCollection, 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as BlogPost));
      
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
  }, [firestore]);


  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-8">All Posts from Firestore Database</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12" />
          </div>
        ) : (
          <BlogView posts={posts} />
        )}
      </main>
    </div>
  );
}
