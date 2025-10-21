
"use client";

import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ReactMarkdown from 'react-markdown';
import { Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import React from 'react';

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const headerImage = PlaceHolderImages.find(img => img.id === 'blog-header');
  const { toast } = useToast();

  const handleShare = async (post: BlogPost) => {
    if (typeof window === 'undefined') return;
    const postUrl = `${window.location.origin}/#${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this blog post: ${post.title}`,
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
    // Check if it's a Firestore Timestamp
    if (date.toDate) {
      return format(date.toDate(), 'MMMM d, yyyy');
    }
    // Check if it's a regular Date object or a string
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };


  return (
    <div className="space-y-8">
      <div className="relative w-full h-48 md:h-72 rounded-lg overflow-hidden shadow-lg">
        {headerImage && (
          <Image
            src={headerImage.imageUrl}
            alt={headerImage.description}
            fill
            className="object-cover"
            data-ai-hint={headerImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                The blogify.blog Post
            </h1>
            <p className="mt-2 md:mt-4 text-lg md:text-xl text-neutral-200 max-w-2xl">
                Insights, stories, and ideas from the forefront of innovation.
            </p>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 grid-cols-1">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Card id={post.id} className="flex flex-col scroll-mt-20 bg-primary/10">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                      <span>Posted on {formatDate(post.createdAt)}</span>
                      {post.category && <Badge variant="secondary">{post.category}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                      skipHtml={true}
                    >
                        {post.content}
                    </ReactMarkdown>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center mt-auto">
                  <p className="text-sm text-muted-foreground">By {post.authorName || 'Anonymous'}</p>
                  <Button variant="ghost" size="icon" onClick={() => handleShare(post)}>
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share Post</span>
                  </Button>
                </CardFooter>
              </Card>
              {/* Mobile Ad Placeholder */}
              <div className="md:hidden w-full h-64 bg-muted/40 flex items-center justify-center rounded-lg shadow">
                <p className="text-muted-foreground">Ad Placeholder</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
