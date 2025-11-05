
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, HelpCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { categories } from '@/lib/categories';
import ContentEditor from './ContentEditor';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';

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
  metaDescription: z.string().optional(),
  featuredImageUrl: z.string().url().optional().or(z.literal('')),
  featuredImageAlt: z.string().optional(),
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
    defaultValues: { 
        title: '', 
        content: '', 
        authorName: '', 
        isPublished: false,
        metaDescription: '',
        featuredImageUrl: '',
        featuredImageAlt: '',
    },
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
        metaDescription: selectedPost.metaDescription || '',
        featuredImageUrl: selectedPost.featuredImageUrl || '',
        featuredImageAlt: selectedPost.featuredImageAlt || '',
      });
    } else {
      form.reset({ 
          title: '', 
          content: '', 
          authorName: user.displayName || 'Admin', 
          category: undefined, 
          isPublished: false,
          metaDescription: '',
          featuredImageUrl: '',
          featuredImageAlt: '',
      });
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
           <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Content Editor Guide</DialogTitle>
                    <DialogDescription>
                        Follow these instructions to create a well-formatted and SEO-friendly blog post.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h4>Content Editor (Markdown)</h4>
                        <p>The content editor uses Markdown, a simple way to format text. Use the toolbar buttons for quick formatting.</p>
                        <ul>
                            <li><strong>Headings (H1-H6):</strong> Use the 'Heading' button to structure your content. H1 is for the main title (though your post title field is separate), H2 for main sections, H3 for sub-sections, etc. This is very important for readability and SEO.</li>
                            <li><strong>Bold:</strong> Use `**text**` to make text bold.</li>
                            <li><strong>Italic:</strong> Use `*text*` to make text italic.</li>
                            <li><strong>Bulleted Lists:</strong> Start a line with `-` to create a list item.</li>
                            <li><strong>Tables:</strong> Use the table button to insert a basic Markdown table structure.</li>
                        </ul>

                        <h4>Working with Links and Media</h4>
                        <p>To add images, videos, or documents, you must first upload them to a file hosting service (like Google Drive, Dropbox, or a dedicated image hosting site like Imgur) and get a direct public link.</p>
                        <ul>
                            <li><strong>Links:</strong> Highlight text and click the Link button. It will wrap your text like `[your text](url)`. Replace `url` with the destination URL.</li>
                            <li><strong>Images:</strong> For an image, the format is `![alt text](image_url)`. The "alt text" is a description of the image for accessibility and SEO.</li>
                            <li><strong>Videos & Documents:</strong> You can link to these just like a regular link. A good practice is to describe what the link is, for example: `[Watch the demo video](video_url)`.</li>
                        </ul>

                        <h4>SEO & Metadata Fields</h4>
                        <p>These fields are critical for how your post appears on search engines and social media.</p>
                        <ul>
                            <li><strong>Meta Description:</strong> A short (150-160 characters) summary of your post. This is often shown by Google under your post title in search results. Make it compelling!</li>
                            <li><strong>Featured Image URL:</strong> The primary image for your post. It will be shown at the top of your article and in social media previews. Provide a full, direct URL to an image.</li>
                            <li><strong>Featured Image Alt Text:</strong> A brief description of the featured image. This is read by screen readers for visually impaired users and helps search engines understand what the image is about.</li>
                        </ul>

                        <h4>Author Name</h4>
                        <p>This is the publicly displayed name of the post's author. By default, it's your admin display name, but you can change it to attribute the post to someone else if needed.</p>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
        </CardHeader>
        <CardContent>
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
              
              <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">SEO & Metadata</CardTitle>
                    <CardDescription>Optimize how your post appears on search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Meta Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A short summary of the post for search engines..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="featuredImageUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Featured Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="featuredImageAlt"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Featured Image Alt Text</FormLabel>
                            <FormControl>
                                <Input placeholder="A descriptive caption for the image" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
              </Card>

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

    