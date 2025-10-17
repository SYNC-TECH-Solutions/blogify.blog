
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import BlogView from '@/components/blog/BlogView';
import { useRouter } from 'next/navigation';

const staticPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to Blogify.blog!",
    content: "This is a placeholder post. Your dynamic content from Firestore will appear here once the security rule deployment issues are resolved. We are working on a fix!",
    authorId: "system",
    authorName: "Blogify Team",
    category: "Announcements",
    isPublished: true,
    createdAt: new Date() as any, 
    updatedAt: new Date() as any,
  },
    {
    id: "2",
    title: "The Power of Static Content",
    content: "By switching to static content temporarily, we can ensure the site remains online and accessible while backend issues are addressed. This demonstrates a robust fallback strategy.",
    authorId: "system",
    authorName: "Dev Team",
    category: "Tech",
    isPublished: true,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  }
];


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

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
        <BlogView posts={staticPosts} />
      </main>
    </div>
  );
}
