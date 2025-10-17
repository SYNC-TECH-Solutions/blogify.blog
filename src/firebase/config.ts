"use client"

// This file is used to store the Firebase configuration.
// It is safe to expose this information to the client.
// See https://firebase.google.com/docs/web/learn-more#config-object

import type { FirebaseOptions } from "firebase/app";

// Fallback for local development or if the global is not set.
const firebaseConfig: FirebaseOptions = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const untypedGlobal: any = globalThis;
if (untypedGlobal.__firebase_config) {
  try {
    const globalConfig = JSON.parse(untypedGlobal.__firebase_config);
    Object.assign(firebaseConfig, globalConfig);
  } catch (e) {
    console.error(
      "Could not parse __firebase_config. Using env config. Error: ",
      e
    );
  }
}

export { firebaseConfig };
