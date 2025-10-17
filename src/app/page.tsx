
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, query, orderBy, collection, where } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import BlogView from '@/components/blog/BlogView';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent } from '@/components/ui/card';

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
    // Only fetch posts if a user is logged in and firestore is available.
    if (!firestore || !user) {
      setPosts([]); // Clear posts if user logs out
      return;
    }
    
    const postsCollection = collection(firestore, postsCollectionPath);
    const q = query(
      postsCollection, 
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
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
  }, [firestore, user, toast]); // Re-run effect when user or firestore instance changes

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
      
      {/* Desktop Ad Placeholders */}
      <aside className="hidden lg:block fixed left-4 top-20 w-40 h-[600px] bg-muted/40 rounded-lg shadow">
          <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">Vertical Ad</p>
          </div>
      </aside>
      <aside className="hidden lg:block fixed right-4 top-20 w-40 h-[600px] bg-muted/40 rounded-lg shadow">
          <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">Vertical Ad</p>
          </div>
      </aside>

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        {user ? (
          <BlogView posts={posts} />
        ) : (
           <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                There are currently issues with displaying public posts. Please sign in to view content.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
