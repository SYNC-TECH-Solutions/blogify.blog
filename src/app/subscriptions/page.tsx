
"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Check, Edit3, Eye, Zap } from 'lucide-react';

export default function SubscriptionsPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const auth = useAuth();
    const router = useRouter();

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

    const handleSubscribe = () => {
        // We will implement the Stripe Checkout logic here in the next step.
        console.log(`Subscribing to plan: €3/month`);
        if (!user) {
            router.push('/admin'); // Or your dedicated login page
        } else {
            // Placeholder for Stripe logic
            alert(`Next step: Integrate Stripe Checkout`);
        }
    };

    const features = [
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "Foster Community",
            description: "Turn passive visitors into active contributors.",
        },
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "Save Time & Resources",
            description: "Generate a constant stream of authentic content without lifting a finger.",
        },
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "Increase Authority",
            description: "Build a knowledge base that positions your brand as an industry leader.",
        },
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "Incredibly Affordable",
            description: "All this for the price of a coffee. A low-risk, high-reward investment.",
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
                                Unlock Your Community's Voice
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                                Turn Your Website into a Content Powerhouse for Just <span className="font-bold text-primary">€3/month!</span>
                            </p>
                            <p className="mt-6 text-muted-foreground max-w-4xl mx-auto">
                                Are you looking for a powerful way to boost engagement, drive organic traffic, and build a vibrant community around your brand? Stop searching. With blogify.blog embed, you can transform your website into a dynamic content hub—effortlessly.
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
                            <CardTitle className="text-center">Why Your Business Needs This</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            {features.map((feature, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="bg-primary/20 p-3 rounded-full mb-3">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="text-center space-y-4">
                        <p className="text-lg text-muted-foreground">Ready to get started? Integrating our powerful tools is as simple as copying and pasting a snippet of code.</p>
                        <Button size="lg" className="text-lg" onClick={handleSubscribe}>
                            Subscribe Now for just €3/month
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
