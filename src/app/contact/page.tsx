
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Rocket, Volume2, Globe } from 'lucide-react';
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
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
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
                  Partner With Us
                </h1>
              </div>
            </div>
            <CardContent className="p-6 md:p-8 text-center">
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Your story deserves a global audience. Your brand needs a launchpad. At blogify.blog, we build the stage and shine the spotlight. Let's create something powerful together.
              </p>
            </CardContent>
          </Card>
          
          <div className="text-center">
             <a href="mailto:sherazhussainofficial1@gmail.com">
                <Button size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Start the Conversation
                </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                   <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="pt-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>We're dedicated to creating a single, dynamic space where the world can discover content on any topic. By connecting with us, you become part of this growing universe of ideas.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                 <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                   <Rocket className="h-8 w-8" />
                </div>
                <CardTitle className="pt-4">Launchpad for Startups & Businesses</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Whether you're a new startup or an established business, getting your message in front of the right audience is key. We specialize in crafting compelling stories that boost your brand's SEO and connect you with a global audience eager for innovation. Email us to get started.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <div className="mx-auto bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center">
                   <Volume2 className="h-8 w-8" />
                </div>
                <CardTitle className="pt-4">Amplify Public Voices</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Have a story to tell or expertise to share? We provide the megaphone. Reach out to contribute your voice to our platform and engage with readers from all walks of life.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
