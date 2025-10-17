"use client";

import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, ArrowLeft } from "lucide-react";

interface HeaderProps {
  user: User | null;
  viewMode: 'blog' | 'admin';
  onAdminLoginClick: () => void;
  onSwitchView: (mode: 'blog' | 'admin') => void;
}

export default function Header({ user, viewMode, onAdminLoginClick, onSwitchView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Blogify</h1>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === 'admin' ? (
            <Button onClick={() => onSwitchView('blog')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          ) : (
            user && (
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
