"use client";

import React, { useEffect, useState } from "react";
import { initializeFirebase, signIn } from ".";
import { Loader } from "@/components/ui/loader";
import { FirebaseProvider } from "./provider";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const init = async () => {
      const firebaseInstances = initializeFirebase();
      await signIn();
      setInstances(firebaseInstances);
    };

    if (!instances) {
        init();
    }
  }, [instances]);

  if (!instances) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader className="h-12 w-12" />
        <p className="ml-4 text-lg font-semibold">Initializing Firebase...</p>
      </div>
    );
  }

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
