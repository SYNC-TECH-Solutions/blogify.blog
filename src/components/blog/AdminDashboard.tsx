
"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminDashboardProps {
  posts: BlogPost[];
  user: User;
  initialPost?: BlogPost | null;
  onClearEdit: () => void;
}

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  authorName: z.string().min(1, 'Author Name is required'),
  category: z.enum(categories as [string, ...string[]], {
    required_error: "You need to select a category.",
  }),
  isPublished: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

const postsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/blog_posts`;

function PostList({
  posts,
  selectedPost,
  onSelectPost,
  onDeletePost,
}: {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost) => void;
  onDeletePost: (post: BlogPost) => void;
}) {
  return (
    <ScrollArea className="h-[450px]">
      <div className="space-y-2 p-4 pt-0">
        {posts.map(post => (
          <div key={post.id} className={`flex items-center justify-between p-3 rounded-lg ${selectedPost?.id === post.id ? 'bg-muted' : ''}`}>
            <div>
              <p className="font-semibold">{post.title}</p>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{post.updatedAt ? format(post.updatedAt.toDate(), 'MMM d, yyyy') : '...'}</span>
                 {post.isPublished ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Draft</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onSelectPost(post)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeletePost(post)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}


export default function AdminDashboard({ posts, user, initialPost = null, onClearEdit }: AdminDashboardProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(initialPost);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '', authorName: '', isPublished: false },
  });

  useEffect(() => {
    setSelectedPost(initialPost);
  }, [initialPost]);

  useEffect(() => {
    if (selectedPost) {
      form.reset({
        title: selectedPost.title,
        content: selectedPost.content,
        authorName: selectedPost.authorName,
        category: selectedPost.category,
        isPublished: selectedPost.isPublished,
      });
    } else {
      form.reset({ title: '', content: '', authorName: user.displayName || 'Admin', category: undefined, isPublished: false });
    }
  }, [selectedPost, form, user.displayName]);

  const { publishedPosts, draftPosts } = useMemo(() => {
    return {
      publishedPosts: posts.filter(p => p.isPublished),
      draftPosts: posts.filter(p => !p.isPublished),
    };
  }, [posts]);

  const handleSetSelectedPost = (post: BlogPost | null) => {
    setSelectedPost(post);
    if (post === null) {
      onClearEdit();
    }
  }

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
        authorId: user.uid, // Ensure authorId is present on updates
        updatedAt: serverTimestamp(),
      };
      setDoc(postRef, postData, { merge: true })
        .then(() => {
          toast({ title: "Post Updated!", description: "Your changes have been saved." });
          handleSetSelectedPost(null);
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      addDoc(postsCollection, postData)
        .then(() => {
          toast({ title: "Post Created!", description: "Your new post is saved as a draft." });
          handleSetSelectedPost(null);
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
          handleSetSelectedPost(null);
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
          {/*
            "Please create a comprehensive `AdminDashboard` component for a Next.js application that allows an admin to create, edit, view, and manage blog posts.

            **Layout & Structure:**

            1.  Use a responsive two-column layout. The left column (spanning 2/3 of the width on medium screens and up) will contain the post editor form. The right column (spanning 1/3) will display the list of existing posts.
            2.  Both columns should be styled using ShadCN's `<Card>` component.

            **Post Editor Form (Left Column):**

            1.  **Functionality:** The form should serve for both creating new posts and editing existing ones. When an existing post is selected from the list, the form should populate with that post's data. When no post is selected, it should be a "Create New Post" form.
            2.  **Form Management:** Use `react-hook-form` with the `zod` resolver for robust validation.
            3.  **Schema:** Create a Zod schema that validates the following fields:
                *   `title`: A non-empty string.
                *   `content`: A non-empty string.
                *   `authorName`: A non-empty string.
                *   `category`: A string selected from a predefined list of categories.
                *   `isPublished`: A boolean, defaulting to `false`.
            4.  **UI Components:** Use the following ShadCN components for the form fields:
                *   `<Switch>` for the `isPublished` status. This should be prominently displayed at the top.
                *   `<Input>` for `title` and `authorName`.
                *   `<Select>` for the `category`, populated with a list of categories (e.g., "Sports", "Tech").
                *   A custom `ContentEditor` component for the `content` field. This editor should support basic Markdown formatting (headings, bold, italic, lists, links, etc.) and use a `<Textarea>`.
            5.  **Actions:**
                *   A "Save Post" button to submit the form. This button should handle both creating new posts (`addDoc`) and updating existing ones (`setDoc` with merge). It should display "Saving..." while submitting.
                *   A "Cancel" button that appears only when editing a post, which clears the form and resets to "Create" mode.
                *   All Firestore write operations must include robust, non-blocking error handling that uses a global `errorEmitter` to emit a `FirestorePermissionError` on failure.
                *   Upon successful creation or update, display a toast notification.

            **Post List (Right Column):**

            1.  **Display:** Show a list of all posts retrieved from Firestore.
            2.  **Filtering:** Implement tabs using `<Tabs>` to filter the list by "All," "Published," and "Drafts." Each tab should show a count of the posts in that category.
            3.  **List Item:** Each post in the list should display:
                *   The post title.
                *   The last updated date.
                *   A `<Badge>` indicating its status ("Published" or "Draft").
                *   An "Edit" `<Button>` (`<Edit>` icon) to load the post into the editor form.
                *   A "Delete" `<Button>` (`<Trash2>` icon) to remove the post.
            4.  **Actions:**
                *   **Create New:** Include a "New" button with a `<PlusCircle>` icon at the top to clear the editor form and start a new post.
                *   **Deletion:** Clicking the "Delete" button should trigger an `<AlertDialog>` to confirm the action before permanently deleting the post from Firestore.

            **Component Integration:**

            *   The `AdminDashboard` component should accept `posts`, the authenticated `user`, an optional `initialPost` for editing, and an `onClearEdit` callback function as props.
            *   The component should manage its own internal state, such as the currently selected post and the delete confirmation dialog."
          */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                      <div className="space-y-0.5">
                        <FormLabel>Publish Post</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
            <Button variant="ghost" onClick={() => handleSetSelectedPost(null)}>Cancel</Button>
          )}
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Post'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Your Posts</CardTitle>
          <Button size="sm" onClick={() => handleSetSelectedPost(null)} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New
          </Button>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <PostList 
                  posts={posts}
                  selectedPost={selectedPost}
                  onSelectPost={handleSetSelectedPost}
                  onDeletePost={openDeleteDialog}
                />
            </TabsContent>
            <TabsContent value="published">
               <PostList 
                  posts={publishedPosts}
                  selectedPost={selectedPost}
                  onSelectPost={handleSetSelectedPost}
                  onDeletePost={openDeleteDialog}
                />
            </TabsContent>
            <TabsContent value="drafts">
               <PostList 
                  posts={draftPosts}
                  selectedPost={selectedPost}
                  onSelectPost={handleSetSelectedPost}
                  onDeletePost={openDeleteDialog}
                />
            </TabsContent>
          </Tabs>
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

    
    