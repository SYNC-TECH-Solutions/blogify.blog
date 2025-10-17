
"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
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
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-muted-foreground prose dark:prose-invert max-w-none">
                        <p>Your privacy is important to us. It is blogify.blog's policy to respect your privacy regarding any information we may collect from you across our website, <a href="https://blogify.blog">blogify.blog</a>, and other sites we own and operate.</p>
                        
                        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
                        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                        <p>The personal details which may be provided by You to Us via the blogify.blog Site are considered "User Information". This may include your name, email address, and other details you provide when you register, post content, or contact us.</p>
                        
                        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
                        <p>We may use the information we collect for various purposes, including to:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Provide, operate, and maintain our website.</li>
                            <li>Improve, personalize, and expand our website.</li>
                            <li>Understand and analyze how you use our website.</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                            <li>Process your transactions.</li>
                            <li>Find and prevent fraud.</li>
                        </ul>
                        <p>We will not use the information You provide to Us for any purpose other than as stated at each location where such information is requested.</p>

                        <h2 className="text-xl font-semibold text-foreground">3. Log Files</h2>
                        <p>blogify.blog follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
                        
                        <h2 className="text-xl font-semibold text-foreground">4. Data Protection and Security</h2>
                        <p>We shall comply with all applicable data protection legislation from time to time in place in respect of any personal information relating to You gathered by Us.</p>
                        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>

                        <h2 className="text-xl font-semibold text-foreground">5. Third-Party Privacy Policies</h2>
                        <p>blogify.blog's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
                        <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>

                        <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
                        <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
                        <p>Please email <a href="mailto:sherazhussainofficial1@gmail.com">sherazhussainofficial1@gmail.com</a> to notify Us of any changes to the information You have previously given or if You wish to withdraw Your consent to Our using Your User Information for the stated purposes or for any form of promotional contact.</p>

                        <h2 className="text-xl font-semibold text-foreground">7. Changes to This Privacy Policy</h2>
                        <p>We reserve the right to change this privacy policy upon the posting of any altered privacy policy upon the blogify.blog Site.</p>
                        <p>This policy is effective as of the last updated date.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
