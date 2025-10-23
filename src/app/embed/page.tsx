
'use client';

import Script from 'next/script';
import Header from '@/components/blog/Header';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function EmbedTestPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const auth = useAuth();
  const router = useRouter();

  React.useEffect(() => {
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
    <>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Embed Script Test Page</h1>
          <p className="text-muted-foreground mb-8">
            This page is for testing the blog post embed widget.
            The button below is what would appear on an external site.
          </p>
          
          <div id="blogify-embed-root"></div>
        
        </main>
      </div>
      <Script
        src="https://embedblogify.netlify.app/embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}
