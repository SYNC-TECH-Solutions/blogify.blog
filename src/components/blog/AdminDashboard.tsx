
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BlogPost } from '@/lib/types';
import { User } from 'firebase/auth';
import { addDoc, setDoc, deleteDoc, serverTimestamp, collection, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { categories } from '@/lib/categories';
import ContentEditor from './ContentEditor';

interface AdminDashboardProps {
  posts: BlogPost[];
  user: User;
}

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  authorName: z.string().min(1, 'Author Name is required'),
  category: z.enum(categories as [string, ...string[]], {
    required_error: "You need to select a category.",
  }),
});

type PostFormData = z.infer<typeof postSchema>;

const postsCollectionPath = 'blog_posts';

export default function AdminDashboard({ posts, user }: AdminDashboardProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '', authorName: '' },
  });

  useEffect(() => {
    if (selectedPost) {
      form.reset({
        title: selectedPost.title,
        content: selectedPost.content,
        authorName: selectedPost.authorName,
        category: selectedPost.category,
      });
    } else {
      form.reset({ title: '', content: '', authorName: user.displayName || 'Admin', category: undefined });
    }
  }, [selectedPost, form, user.displayName]);

  const onSubmit = async (data: PostFormData) => {
    if (!firestore) {
        toast({ title: "Error", description: "Firestore not initialized.", variant: "destructive" });
        return;
    }
    const postsCollection = collection(firestore, postsCollectionPath);

    if (selectedPost) {
      // Update existing post
      const postRef = doc(postsCollection, selectedPost.id);
      const postData = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      setDoc(postRef, postData, { merge: true })
        .then(() => {
          toast({ title: "Post Updated!", description: "Your changes have been saved." });
          setSelectedPost(null);
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: postRef.path,
            operation: 'update',
            requestResourceData: postData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

    } else {
      // Create new post
      const postData = {
        ...data,
        authorId: user.uid,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      addDoc(postsCollection, postData)
        .then(() => {
          toast({ title: "Post Created!", description: "Your new post is live." });
          setSelectedPost(null);
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: postsCollection.path,
            operation: 'create',
            requestResourceData: postData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  };

  const handleDelete = async () => {
    if (!postToDelete || !firestore) return;
    
    const postRef = doc(firestore, postsCollectionPath, postToDelete.id);
    
    deleteDoc(postRef)
      .then(() => {
        toast({ title: "Post Deleted", description: "The post has been removed." });
        if (selectedPost?.id === postToDelete.id) {
          setSelectedPost(null);
        }
        setPostToDelete(null);
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: postRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    setIsDeleteDialogOpen(false);
  };
  
  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Post Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <ContentEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {selectedPost && (
            <Button variant="ghost" onClick={() => setSelectedPost(null)}>Cancel</Button>
          )}
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Post'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Posts</CardTitle>
          <Button size="sm" onClick={() => setSelectedPost(null)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New
          </Button>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4 pt-0">
              {posts.map(post => (
                <div key={post.id} className={`flex items-center justify-between p-3 rounded-lg ${selectedPost?.id === post.id ? 'bg-muted' : ''}`}>
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated: {post.updatedAt ? format(post.updatedAt.toDate(), 'MMM d, yyyy') : '...'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedPost(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => openDeleteDialog(post)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

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
