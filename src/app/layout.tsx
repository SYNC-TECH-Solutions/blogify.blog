
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Footer from '@/components/blog/Footer';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
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
          <Footer />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
