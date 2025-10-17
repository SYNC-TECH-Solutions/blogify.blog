"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function TermsConditionsPage() {
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

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Terms & Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            Coming Soon!
                        </p>
                        <p>
                            We are currently drafting our Terms & Conditions to ensure they are comprehensive and clear.
                            Please check back later to review our terms of service.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
