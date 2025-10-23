
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Loader } from '@/components/ui/loader';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function AllPostsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore || !user) {
      if(authChecked && !user) {
         router.push('/admin'); // Redirect to admin login if not authenticated
      }
      setPosts([]);
      setLoading(false);
      return;
    };
    
    setLoading(true);

    const postsCollection = collection(firestore, postsCollectionPath);
    const q = query(
      postsCollection
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as BlogPost))
        .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                // Firestore Timestamps have a toMillis() method
                const aMillis = a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt as any).getTime();
                const bMillis = b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt as any).getTime();
                return bMillis - aMillis;
            }
            return 0;
        });
      
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
  }, [firestore, user, authChecked, router]);


  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  };
  
  const formatDate = (date: any) => {
    if (!date) return '...';
    if (date.toDate) {
      return format(date.toDate(), 'MMMM d, yyyy');
    }
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader className="h-12 w-12" />
      </div>
    )
  }
  
  if(!user){
    // This will be rendered briefly before the redirect in useEffect kicks in
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
          <CardHeader className="px-0">
            <CardTitle className="text-4xl font-extrabold text-foreground tracking-tight">All Posts from Firestore Database</CardTitle>
            <CardDescription>A complete list of every post in the database, both published and drafts.</CardDescription>
          </CardHeader>
          
            <div className="space-y-8">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      By {post.authorName || 'Anonymous'} on {formatDate(post.createdAt)} - {post.isPublished ? "Published" : "Draft"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="prose prose-lg dark:prose-invert max-w-none">
                        <ReactMarkdown skipHtml={true}>
                            {post.content}
                        </ReactMarkdown>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
      </main>
    </div>
  );
}
