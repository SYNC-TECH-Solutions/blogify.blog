"use client";

import Link from "next/link";
import { BookOpen, Facebook, Instagram, Twitter, Rss } from "lucide-react";
import { categories } from "@/lib/categories";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    const BloggerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 11h2v2h-2z" />
      <path d="M18 11h2v2h-2z" />
      <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM8 11H6v2h2v-2zm0 4H6v2h2v-2zm8-4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
    );
    return (
        <footer className="bg-card border-t text-card-foreground">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1 flex flex-col items-start">
                         <Link href="/" className="flex items-center gap-3 mb-4">
                            <BookOpen className="h-7 w-7 text-primary" />
                            <h1 className="text-2xl font-bold text-foreground">Blogify</h1>
                        </Link>
                        <p className="text-sm text-muted-foreground">Your global stage for ideas, insights, and innovation.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.slice(0, 5).map(category => (
                                <li key={category}>
                                    <Link href={`/category/${category.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-muted-foreground hover:text-primary">
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Blogify</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms-conditions" className="text-sm text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-6 w-6" /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><BloggerIcon className="h-6 w-6" /></Link>
                        </div>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Blogify. All Rights Reserved. Powered by SYNC TECH Solutions.
                </div>
            </div>
        </footer>
    );
}
