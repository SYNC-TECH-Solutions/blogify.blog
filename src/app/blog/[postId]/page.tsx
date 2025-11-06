
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import { Loader } from '@/components/ui/loader';
import Header from '@/components/blog/Header';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function PostPage() {
  const params = useParams();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!firestore || !postId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const postRef = doc(firestore, postsCollectionPath, postId);

    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const postData = { id: docSnap.id, ...docSnap.data() } as BlogPost;
        if (postData.isPublished) {
          setPost(postData);
        } else {
          setPost(null); // or redirect, or show "not found"
        }
      } else {
        setPost(null);
      }
      setLoading(false);
    }, (error) => {
      const permissionError = new FirestorePermissionError({
        path: postRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, postId]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  };

  const handleShare = async () => {
    if (!post || typeof window === 'undefined') return;
    const postUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.metaDescription || `Check out this blog post: ${post.title}`,
          url: postUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: "Link Copied!",
          description: "The post link has been copied to your clipboard.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Error",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      }
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


  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        {post ? (
          <Card>
            {post.featuredImageUrl && (
              <div className="relative w-full h-64 md:h-96 rounded-t-lg overflow-hidden">
                <img
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt || post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold tracking-tight">{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap pt-2">
                  <span>Posted on {formatDate(post.createdAt)}</span>
                  <span className="text-muted-foreground">&bull;</span>
                  <span>By {post.authorName || 'Anonymous'}</span>
                  {post.category && <Badge variant="secondary" className="ml-auto">{post.category}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown skipHtml={true}>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share Post</span>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-3xl font-bold text-muted-foreground">Post not found.</p>
              <p className="text-center text-muted-foreground mt-2">This post may have been moved or deleted.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
