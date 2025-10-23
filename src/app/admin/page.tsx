
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import AdminDashboard from '@/components/blog/AdminDashboard';
import AdminLoginModal from '@/components/blog/AdminLoginModal';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoginModalOpen(true);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    // Return early if firestore is not initialized or if the user is not logged in.
    // Also, if auth is still loading, we shouldn't fetch.
    if (!firestore || !user || loading) {
      // If we are not loading auth anymore and there's no user, clear posts.
      if (!loading && !user) {
        setPosts([]);
      }
      return;
    }

    const postsCollection = collection(firestore, postsCollectionPath);
    // This query fetches all posts, ordered by creation date. 
    // This is for the admin panel, so it should show both published and draft posts.
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Ensure isPublished is a boolean, defaulting to false if not present
            isPublished: data.isPublished === true, 
        } as BlogPost;
      });
      setPosts(postsData);
    }, (error) => {
      const permissionError = new FirestorePermissionError({
        path: (q as any)._query.path.toString(),
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    // Cleanup the listener when the component unmounts or dependencies change.
    return () => unsubscribe();
  }, [firestore, user, loading]); // This effect now correctly depends on user and loading state.


  const handleAdminLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };
  
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    if (!user) {
      router.push('/');
    }
  }

  const handleLogout = () => {
    if (auth) {
      signOut(auth);
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader className="h-12 w-12" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {user ? (
          <AdminDashboard posts={posts} user={user} />
        ) : (
          <AdminLoginModal
            isOpen={isLoginModalOpen}
            onClose={handleLoginModalClose}
            onLoginSuccess={handleAdminLoginSuccess}
          />
        )}
      </main>
    </div>
  );
}
