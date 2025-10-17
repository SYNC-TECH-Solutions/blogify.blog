"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ContactPage() {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();
  const router = useRouter();

  const contactImage = PlaceHolderImages.find(p => p.id === 'contact-us-hero');

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/');
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-12">
          <Card className="overflow-hidden shadow-lg">
            <div className="relative w-full h-48 md:h-64">
              {contactImage && (
                <Image
                  src={contactImage.imageUrl}
                  alt={contactImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={contactImage.imageHint}
                  priority
                />
              )}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight text-center px-4">
                  Get in Touch
                </h1>
              </div>
            </div>
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                We'd love to hear from you! Whether you have a question, a business inquiry, or a story you think the world needs to hear, our inbox is always open.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Card className="bg-secondary border-none max-w-2xl w-full">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Email Us Directly</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground text-center">
                <p>
                  For the fastest response, please send us an email. Click the button below to open your default email client and start a conversation.
                </p>
                <p>
                  We welcome feedback, collaboration proposals, and submissions from new and established writers. Let's connect and create something amazing together.
                </p>
                <a href="mailto:sherazhussainofficial1@gmail.com">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Mail className="mr-2 h-5 w-5" />
                    Send an Email
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
