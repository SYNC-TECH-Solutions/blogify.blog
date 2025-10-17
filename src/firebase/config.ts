"use client"

// This file is used to store the Firebase configuration.
// It is safe to expose this information to the client.
// See https://firebase.google.com/docs/web/learn-more#config-object

import type { FirebaseOptions } from "firebase/app";

const untypedGlobal: any = globalThis;
let firebaseConfig: FirebaseOptions = {};
try {
  firebaseConfig = JSON.parse(untypedGlobal.__firebase_config || "{}");
} catch (e) {
  console.error(
    "Could not parse __firebase_config. Using empty config. Error: ",
    e
  );
}

export { firebaseConfig };
