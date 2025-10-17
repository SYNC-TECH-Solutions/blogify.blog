"use client";

import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, ArrowLeft, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: User | null;
  viewMode: 'blog' | 'admin';
  onAdminLoginClick: () => void;
  onLogout: () => void;
  onSwitchView: (mode: 'blog' | 'admin') => void;
}

export default function Header({ user, viewMode, onAdminLoginClick, onLogout, onSwitchView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Blogify</h1>
        </div>
        <div className="flex items-center gap-4">
          {viewMode === 'admin' && (
            <Button onClick={() => onSwitchView('blog')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          )}

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
                {viewMode === 'blog' && (
                   <DropdownMenuItem onClick={() => onSwitchView('admin')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            viewMode === 'blog' && (
              <Button onClick={onAdminLoginClick}>
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
