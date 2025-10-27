
"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

// Define your subscription plans here
const subscriptionPlans = [
    {
        id: 'price_basic',
        name: 'Basic',
        price: '$10',
        priceFrequency: '/month',
        description: 'Perfect for getting started and exploring.',
        features: [
            'Access to all public blog posts',
            'Basic member badge',
            'Email support',
        ],
        cta: 'Choose Basic',
    },
    {
        id: 'price_pro',
        name: 'Pro',
        price: '$25',
        priceFrequency: '/month',
        description: 'For professionals who need more features.',
        features: [
            'Everything in Basic',
            'Access to exclusive content',
            'Pro member badge',
            'Priority email support',
            'Early access to new posts',
        ],
        cta: 'Choose Pro',
        isPopular: true,
    },
    {
        id: 'price_premium',
        name: 'Premium',
        price: '$50',
        priceFrequency: '/month',
        description: 'For power users and businesses.',
        features: [
            'Everything in Pro',
            'Direct support line',
            'Premium member badge',
            'Feature requests',
            'Join our community chat',
        ],
        cta: 'Choose Premium',
    },
];

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

    const handleSubscribe = (planId: string) => {
        // We will implement the Stripe Checkout logic here in the next step.
        console.log(`Subscribing to plan: ${planId}`);
        if (!user) {
            router.push('/admin'); // Or your dedicated login page
        } else {
            // Placeholder for Stripe logic
            alert(`Next step: Integrate Stripe Checkout for plan ${planId}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Choose Your Plan
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Unlock exclusive content and support our work by becoming a member.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {subscriptionPlans.map((plan) => (
                        <Card key={plan.id} className={`flex flex-col ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}>
                            {plan.isPopular && (
                                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-bold rounded-t-lg">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="text-center mb-6">
                                    <span className="text-4xl font-extrabold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.priceFrequency}</span>
                                </div>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 mr-2" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full" 
                                    variant={plan.isPopular ? 'default' : 'outline'}
                                    onClick={() => handleSubscribe(plan.id)}
                                >
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                 <div className="text-center mt-12 text-sm text-muted-foreground">
                    <p>All payments are securely processed by Stripe. You can cancel your subscription at any time.</p>
                </div>
            </main>
        </div>
    );
}
