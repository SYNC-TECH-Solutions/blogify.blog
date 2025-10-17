"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { initializeFirebase, signIn } from ".";
import { Loader } from "@/components/ui/loader";

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [instances, setInstances] = useState<FirebaseContextValue | null>(null);

  useEffect(() => {
    const init = async () => {
      const { app, auth, firestore } = initializeFirebase();
      await signIn();
      setInstances({ app, auth, firestore });
    };

    init();
  }, []);
  
  const memoizedValue = useMemo(() => {
    if (!instances) {
      return { app: null, auth: null, firestore: null };
    }
    return { app: instances.app, auth: instances.auth, firestore: instances.firestore };
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
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useContext(FirebaseContext)?.app;
export const useAuth = () => useContext(FirebaseContext)?.auth;
export const useFirestore = () => useContext(FirebaseContext)?.firestore;
