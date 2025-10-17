
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

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const headerImage = PlaceHolderImages.find(img => img.id === 'blog-header');
  const { toast } = useToast();

  const handleShare = async (post: BlogPost) => {
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
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight text-center px-4">
            The Blogify.blog Post
          </h1>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Card key={post.id} id={post.id} className="flex flex-col scroll-mt-20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <span>Posted on {post.createdAt ? format(post.createdAt.toDate(), 'MMMM d, yyyy') : '...'}</span>
                    {post.category && <Badge variant="secondary">{post.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
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
          ))}
        </div>
      )}
    </div>
  );
}
