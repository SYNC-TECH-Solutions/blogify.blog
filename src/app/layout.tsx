
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Footer from '@/components/blog/Footer';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { URL } from 'url';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://blogify.blog'),
  title: 'blogify.blog - Your Global Content & Startup Platform',
  description: 'blogify.blog is a global platform for discovering content across all categories and a launchpad for startups to gain visibility on search engines. Founded by SS Brothers.',
  icons: {
    icon: '/bbrb.png',
  },
  openGraph: {
    images: ['/blogifybanner.png'],
  },
  other: {
    "google-adsense-account": "ca-pub-7334468000130380",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn("h-full flex flex-col font-sans antialiased", inter.variable)}>
        <FirebaseClientProvider>
          <div className="flex-grow">
            {children}
          </div>
          <div className="container max-w-7xl mx-auto px-4 py-8">
             <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-foreground">Infinite Content. Price of a Coffee.</h3>
                <p className="text-muted-foreground mt-2 mb-4 max-w-2xl mx-auto">Unleash an endless stream of user-generated articles and boost your SEO for just €2.99 a month.</p>
                <Link href="/subscriptions">
                    <Button>Subscribe Now</Button>
                </Link>
            </div>
          </div>
          <Footer />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
