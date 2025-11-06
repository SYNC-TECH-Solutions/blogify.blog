
"use client";

import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const headerImage = PlaceHolderImages.find(img => img.id === 'blog-header');
  
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

  const createSnippet = (content: string) => {
    // Remove Markdown images, links, and other formatting for a clean text snippet.
    const plainText = content
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove link markdown but keep text
      .replace(/#+\s/g, '') // Remove headings
      .replace(/[*_`~]/g, ''); // Remove emphasis characters
    return plainText.substring(0, 150) + '...';
  }


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
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/blog/${post.id}`} className="block">
                    <div className="relative w-full h-48 bg-muted">
                        {post.featuredImageUrl ? (
                            <img
                                src={post.featuredImageUrl}
                                alt={post.featuredImageAlt || post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10"></div>
                        )}
                    </div>
                </Link>
                <CardHeader>
                    {post.category && <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>}
                    <Link href={`/blog/${post.id}`} className="block">
                        <CardTitle className="text-xl font-bold tracking-tight hover:text-primary">{post.title}</CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-3 text-sm">
                        {post.metaDescription || createSnippet(post.content)}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex justify-between items-center text-xs text-muted-foreground">
                    <div>
                        <p>By {post.authorName || 'Anonymous'}</p>
                        <p>{formatDate(post.createdAt)}</p>
                    </div>
                    <Link href={`/blog/${post.id}`} passHref>
                        <Button variant="outline" size="sm">
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
