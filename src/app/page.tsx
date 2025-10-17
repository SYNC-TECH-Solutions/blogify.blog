"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import BlogView from '@/components/blog/BlogView';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postsCollectionPath = 'blog_posts';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();
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
    
    const postsCollection = collection(firestore, postsCollectionPath);
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BlogPost));
      setPosts(postsData);
    }, async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: postsCollection.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BlogView posts={posts} />
      </main>
    </div>
  );
}
