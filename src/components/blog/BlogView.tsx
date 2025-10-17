"use client";

import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const headerImage = PlaceHolderImages.find(img => img.id === 'blog-header');

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
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            The Blogify Post
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
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          {posts.map(post => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">{post.title}</CardTitle>
                <CardDescription>
                  Posted on {post.createdAt ? format(post.createdAt.toDate(), 'MMMM d, yyyy') : '...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
                  {post.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
