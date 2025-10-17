"use client";

import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, UserCircle, LayoutDashboard, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto grid h-16 grid-cols-3 items-center px-4">
        <div className="flex justify-start">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Blogify</h1>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <p className="text-sm text-muted-foreground">Powered by</p>
            <p className="text-sm font-semibold">SYNC TECH Solutions</p>
          </div>
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
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/admin">
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
