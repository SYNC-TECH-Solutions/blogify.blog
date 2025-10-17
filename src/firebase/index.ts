"use client";

import {
  initializeApp,
  getApp,
  getApps,
  FirebaseApp,
} from "firebase/app";
import { getAuth, Auth, signInWithCustomToken } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

const untypedGlobal: any = globalThis;
export const initialAuthToken: string | null = untypedGlobal.__initial_auth_token || null;

export const initializeFirebase = (): FirebaseInstances => {
  if (firebaseInstances) {
    return firebaseInstances;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
};

export { useFirebase, useFirebaseApp, useAuth, useFirestore } from "./provider";

export const signIn = async () => {
    const { auth } = initializeFirebase();
    if (initialAuthToken && !auth.currentUser) {
        try {
            await signInWithCustomToken(auth, initialAuthToken);
        } catch (error) {
            console.error("Failed to sign in with custom token", error);
        }
    }
}
