"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const auth = useAuth();
    const router = useRouter();

    const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-hero');
    const missionImage = PlaceHolderImages.find(p => p.id === 'mission-vision');

    React.useEffect(() => {
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
                            {aboutImage && (
                                <Image
                                    src={aboutImage.imageUrl}
                                    alt={aboutImage.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={aboutImage.imageHint}
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight text-center px-4">
                                    Welcome to Blogify
                                </h1>
                            </div>
                        </div>
                        <CardContent className="p-6 md:p-8">
                            <p className="text-lg md:text-xl text-center text-muted-foreground">
                                Your global stage for ideas, insights, and innovation. We are the launchpad for startups and a universe of knowledge for curious minds.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold">Our Mission</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-base text-muted-foreground">
                                    <p>
                                        At Blogify, our mission is simple: to create a single, dynamic space where anyone can discover a world of content across every imaginable category. From the intricacies of the financial market to the latest trends in technology and materials, we provide a platform for voices from both the business and public sectors.
                                    </p>
                                    <p>
                                        We believe in the power of blogs to inform, inspire, and connect. For our readers, we are a trusted source of knowledge. For creators and businesses, we are a powerful megaphone to reach a global audience.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="order-1 md:order-2 relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
                            {missionImage && (
                                <Image
                                    src={missionImage.imageUrl}
                                    alt={missionImage.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={missionImage.imageHint}
                                />
                            )}
                        </div>
                    </div>
                    
                    <Card className="bg-secondary border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-center">A Paradise for Startups</CardTitle>
                            <p className="text-center text-muted-foreground pt-2">
                                Getting noticed is the first step to success. We make it happen.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4 text-base text-center max-w-3xl mx-auto">
                            <p>
                                What makes Blogify special is our dedication to being a "startup's paradise." In the crowded digital landscape, we provide a clear path for new ventures to get discovered. By allowing us to write a blog about you, we leverage our platform's growing authority to put your brand in front of the eyes that matter, boosting your visibility on Google and other search engines.
                            </p>
                            <p>
                                Your story deserves to be heard. Let us be the ones to tell it.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">The Visionaries Behind the Screen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-base text-muted-foreground">
                           <p>
                                Blogify was founded by the <strong>SS Brothers</strong>, a team of forward-thinkers passionate about leveraging new technologies to empower people around the world. With roots in the vibrant city of lights, Karachi, Pakistan, Blogify is a fully remote company with a global mindset.
                           </p>
                           <p>
                                Our team is driven by a shared commitment to staying at the forefront of the new era, constantly exploring innovative ways to help individuals and businesses thrive. We believe that a great idea can come from anywhere, and our mission is to ensure it can be heard everywhere.
                           </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
