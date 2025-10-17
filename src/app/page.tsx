"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import BlogView from '@/components/blog/BlogView';
import AdminDashboard from '@/components/blog/AdminDashboard';
import AdminLoginModal from '@/components/blog/AdminLoginModal';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const app_id: string = (globalThis as any).__app_id || 'blogify-cms-app-local';
const postsCollectionPath = `/artifacts/${app_id}/public/data/blog_posts`;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewMode, setViewMode] = useState<'blog' | 'admin'>('blog');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && window.location.pathname === '/admin') {
        setViewMode('admin');
      }
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
    }, (error) => {
      console.error("Firestore Error:", error);
      toast({
        title: "Error Fetching Posts",
        description: "Could not retrieve blog posts from the database.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [firestore, toast]);

  useEffect(() => {
    // If the path is /admin and the user is not logged in, show the login modal.
    if (window.location.pathname === '/admin' && !user) {
      setIsLoginModalOpen(true);
    }
  }, [user]);

  const handleAdminLoginSuccess = () => {
    setViewMode('admin');
    setIsLoginModalOpen(false);
    router.push('/');
  };
  
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    if(window.location.pathname === '/admin' && !user) {
      router.push('/');
    }
  }

  const handleSwitchView = (mode: 'blog' | 'admin') => {
    if (mode === 'admin' && !user) {
      setIsLoginModalOpen(true);
    } else {
      setViewMode(mode);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onAdminLoginClick={() => handleSwitchView('admin')}
        viewMode={viewMode}
        onSwitchView={handleSwitchView}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {viewMode === 'blog' ? (
          <BlogView posts={posts} />
        ) : (
          user && <AdminDashboard posts={posts} user={user} />
        )}
      </main>
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
