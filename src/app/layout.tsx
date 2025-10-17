
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Footer from '@/components/blog/Footer';

export const metadata: Metadata = {
  title: 'Blogify.blog - Your Global Content & Startup Platform',
  description: 'Blogify.blog is a global platform for discovering content across all categories and a launchpad for startups to gain visibility on search engines. Founded by SS Brothers.',
  icons: {
    icon: '/favicon.ico',
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
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full flex flex-col">
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
