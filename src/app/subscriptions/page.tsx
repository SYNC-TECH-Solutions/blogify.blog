
"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Check, Edit3, Eye, Zap, Users, Gem, Rocket } from 'lucide-react';
import { createCheckoutSession } from '@/app/actions/stripe';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/ui/loader';

export default function SubscriptionsPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

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

    const handleSubscribe = async () => {
        setIsLoading(true);
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to subscribe.",
                variant: "destructive"
            });
            router.push('/admin'); 
            setIsLoading(false);
            return;
        }

        try {
            const { url } = await createCheckoutSession(user.uid);
            if (url) {
                router.push(url);
            } else {
                throw new Error("Could not create checkout session.");
            }
        } catch (error: any) {
            toast({
                title: "Subscription Error",
                description: error.message || "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    const powerFeatures = [
        {
            icon: <Users className="h-8 w-8 text-primary" />,
            title: "Power of Community Engagement",
            description: "Give your users a voice. Turn passive visitors into active contributors, fostering a powerful sense of community and loyalty around your brand.",
        },
        {
            icon: <Gem className="h-8 w-8 text-primary" />,
            title: "Power of Effortless Content Generation",
            description: "Create a self-sustaining engine for authentic articles, including an AI assistant that can produce 5,000-word, SEO-optimized posts from a single prompt.",
        },
        {
            icon: <Zap className="h-8 w-8 text-primary" />,
            title: "Power of Simplicity and Speed",
            description: "No need for a team of developers. Simply copy a line of code, paste it into your HTML, and your fully-featured content solution is live in minutes.",
        },
        {
            icon: <Rocket className="h-8 w-8 text-primary" />,
            title: "Power of Enhanced SEO & Authority",
            description: "A steady stream of fresh, high-quality content drives organic traffic, improves search rankings, and establishes your site as an industry authority.",
        },
    ]

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <div className="space-y-12">
                    <Card className="bg-primary/10 border-primary shadow-lg overflow-hidden">
                        <div className="p-8 text-center">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                Turn Your Website Into a Collaborative Content Platform
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                                Instantly add a "blogging-as-a-service" toolkit to your site for just <span className="font-bold text-primary">€2.99/month!</span>
                            </p>
                            <p className="mt-6 text-muted-foreground max-w-4xl mx-auto">
                                Our simple, copy-and-paste embeds allow you to seamlessly integrate a complete content creation and display system directly into your own platform, without needing to build or maintain a complex backend.
                            </p>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-primary/20 text-primary rounded-lg p-3">
                                    <Edit3 className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>The "Create Post" Embed</CardTitle>
                                    <CardDescription>Empower Your Users to Contribute</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">Empower Your Users:</span> Allow authenticated users to write, format, and publish posts to blogify.blog without leaving your site.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">AI-Powered Writing Assistant:</span> Users get access to a state-of-the-art AI that can generate SEO-optimized articles from a simple topic.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">Seamless Integration:</span> A simple "Post to blogify.blog" button opens a secure, feature-rich editor right on your page. It’s as easy as copy and paste.</span>
                                </li>
                            </CardContent>
                        </Card>

                        <Card>
                             <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-primary/20 text-primary rounded-lg p-3">
                                    <Eye className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>The "Display Posts" Embed</CardTitle>
                                    <CardDescription>Showcase Your Content Beautifully</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                               <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">Showcase Your Content:</span> Automatically fetch and display all published posts from your community on any page. Your content, your branding.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">Drive Engagement:</span> Keep visitors on your site longer by showcasing a rich library of relevant, user-generated articles.</span>
                                </li>
                                <li className="flex items-start">
                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                                    <span><span className="font-semibold">Boost Your SEO:</span> Fresh, relevant content is king. Let your community help you climb the search engine rankings.</span>
                                </li>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-3xl font-bold">The Power of blogify.blog Embed</CardTitle>
                             <CardDescription className="text-center">Outsource your content creation to your most passionate users with zero technical effort.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            {powerFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="bg-primary/20 p-3 rounded-lg mt-1">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="text-center space-y-4">
                        <p className="text-lg text-muted-foreground">Ready to get started? Integrating our powerful tools is as simple as copying and pasting a snippet of code.</p>
                        <Button size="lg" className="text-lg" onClick={handleSubscribe} disabled={isLoading}>
                            {isLoading ? <Loader className="mr-2 h-5 w-5 animate-spin" /> : null}
                            {isLoading ? "Redirecting..." : "Subscribe Now for just €2.99/month"}
                        </Button>
                         <p className="text-sm text-muted-foreground">
                            Payments are securely processed by Stripe. You can cancel your subscription at any time.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
