
"use client";

import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const headerContent = [
  {
    title: "The blogify.blog Post",
    subtitle: "Insights, stories, and ideas from the forefront of innovation.",
    cta: null,
  },
  {
    title: "Infinite Content. Price of a Coffee.",
    subtitle: "Unleash an endless stream of user-generated articles and boost your SEO for just €2.99 a month.",
    cta: {
      text: "Subscribe Now",
      href: "/subscriptions",
    },
  },
  {
    title: "Ready to give your business a new look?",
    subtitle: "Partner with us to amplify your brand and reach a global audience.",
    cta: {
        text: "Contact Us",
        href: "/contact"
    }
  }
];

const typingTarget = "#Welcome to blogify.blog";

export default function BlogView({ posts }: { posts: BlogPost[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    // Typing effect for the first slide
    if (currentIndex === 0) {
      if (typedText.length < typingTarget.length) {
        const timeoutId = setTimeout(() => {
          setTypedText(typingTarget.slice(0, typedText.length + 1));
        }, 100); // Typing speed
        return () => clearTimeout(timeoutId);
      }
    }

    // Interval for changing slides
    const interval = setInterval(() => {
      // When transitioning away from the typing slide, reset it
      if (currentIndex === 0) {
        setTypedText("");
      }
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (headerContent.length + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, typedText]);
  
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
      <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center p-4 z-10 w-full max-w-4xl mx-auto">
          {/* Typing Animation Slide */}
          <div
            className={cn(
              'transition-opacity duration-1000 ease-in-out',
              currentIndex === 0 ? 'opacity-100' : 'opacity-0 absolute'
            )}
          >
            {currentIndex === 0 && (
                <div className="animate-in fade-in-0 slide-in-from-bottom-5 duration-700 font-mono text-left bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-600/50 backdrop-blur-sm">
                    <div className="text-gray-400 text-sm">
                        <span>~</span>/<span>post.md</span>
                    </div>
                    <div className="mt-2 text-lg sm:text-xl text-white">
                        <span className="text-primary">{typedText.split(" ")[0]}</span>
                        <span>{typedText.substring(typedText.indexOf(" "))}</span>
                        <span className="inline-block w-2 h-5 sm:h-6 bg-white animate-pulse ml-1" />
                    </div>
                    <div className="border-t border-dashed border-gray-600/50 my-4"></div>
                    <div className="text-gray-400 text-sm mb-2">PREVIEW</div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        {typedText.replace(/#/g, '')}
                    </h1>
                </div>
            )}
          </div>
          
          {/* Other Text Slides */}
          {headerContent.map((item, index) => (
            <div
              key={index}
              className={cn(
                'transition-opacity duration-1000 ease-in-out',
                index + 1 === currentIndex ? 'opacity-100' : 'opacity-0 absolute'
              )}
            >
              {index + 1 === currentIndex && (
                <div className="animate-in fade-in-0 slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        {item.title}
                    </h1>
                    <p className="mt-2 md:mt-4 text-lg text-neutral-200 max-w-2xl mx-auto">
                        {item.subtitle}
                    </p>
                    {item.cta && (
                        <Link href={item.cta.href} passHref>
                            <Button className="mt-4" size="lg">{item.cta.text}</Button>
                        </Link>
                    )}
                </div>
              )}
            </div>
          ))}
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
