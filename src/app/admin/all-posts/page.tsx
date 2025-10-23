
"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import type { BlogPost } from '@/lib/types';
import Header from '@/components/blog/Header';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader } from '@/components/ui/loader';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

export default function AllPostsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

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

  const handleTogglePublish = async (post: BlogPost) => {
    if (!firestore) return;
    const postRef = doc(firestore, postsCollectionPath, post.id);
    const newStatus = !post.isPublished;
    
    updateDoc(postRef, { isPublished: newStatus })
      .then(() => {
        toast({
          title: `Post ${newStatus ? 'Published' : 'Unpublished'}`,
          description: `"${post.title}" is now ${newStatus ? 'live' : 'a draft'}.`,
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: postRef.path,
          operation: 'update',
          requestResourceData: { isPublished: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!postToDelete || !firestore) return;
    const postRef = doc(firestore, postsCollectionPath, postToDelete.id);
    
    deleteDoc(postRef)
      .then(() => {
        toast({
          title: "Post Deleted",
          description: `"${postToDelete.title}" has been permanently removed.`,
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: postRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    setIsDeleteDialogOpen(false);
    setPostToDelete(null);
  };
  
  const handleEdit = (post: BlogPost) => {
    router.push(`/admin?postId=${post.id}`);
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
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTogglePublish(post)}>
                        {post.isPublished ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {post.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(post)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post titled "{postToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
