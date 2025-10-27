
"use client";

import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, LayoutDashboard, Menu, Facebook, Instagram, Twitter, Rss, Archive, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto grid h-16 grid-cols-3 items-center px-4">
        <div className="flex justify-start">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-grow">
                <div className="px-3 py-2 text-base font-semibold text-foreground">Categories</div>
                <nav className="pr-4">
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category}>
                        <Link href={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted">
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <Separator className="my-4" />
                <nav className="pr-4">
                  <ul className="space-y-2">
                     <li>
                      <Link href="/subscriptions" className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted">
                        Subscriptions
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted">
                        About blogify.blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </nav>
              </ScrollArea>
              <SheetFooter className="mt-auto border-t pt-4">
                <div className="flex w-full justify-center gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Facebook className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-6 w-6" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    <Rss className="h-6 w-6" />
                  </Link>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/bbrb.png" alt="blogify.blog Logo" width={28} height={28} />
            <h1 className="text-2xl font-bold text-foreground">
              blogify<span className="text-primary text-lg">.blog</span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="https://synctech.ie" target="_blank" rel="noopener noreferrer" className="hidden sm:flex flex-col items-end -space-y-1.5">
            <p className="text-[10px] text-muted-foreground">Powered by</p>
            <p className="text-sm font-bold">
                <span className="text-foreground">SYNC </span>
                <span className="text-primary">TECH</span>
            </p>
            <p className="text-sm font-bold text-foreground">Solutions</p>
          </Link>
          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/all-posts">
                    <Archive className="mr-2 h-4 w-4" />
                    <span>All Posts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/subscriptions">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscriptions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
