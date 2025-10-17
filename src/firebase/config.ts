"use client"

// This file is used to store the Firebase configuration.
// It is safe to expose this information to the client.
// See https://firebase.google.com/docs/web/learn-more#config-object

import type { FirebaseOptions } from "firebase/app";

const untypedGlobal: any = globalThis;
let firebaseConfig: FirebaseOptions = {};
try {
  // This is a global variable that is injected by the Firebase Studio environment.
  // It is not available in a local development environment.
  const configString = untypedGlobal.__firebase_config;
  if (configString) {
    firebaseConfig = JSON.parse(configString);
  } else {
    // Fallback for local development or if the global is not set.
    firebaseConfig = {
      "projectId": "studio-3252776436-c7bc7",
      "appId": "1:779621441177:web:9bf7f58524a1d84e2d6208",
      "apiKey": "AIzaSyDlSF4MJ6F3rBwraAS04aFMdUAXifhecoc",
      "authDomain": "studio-3252776436-c7bc7.firebaseapp.com",
      "measurementId": "",
      "messagingSenderId": "779621441177"
    };
  }
} catch (e) {
  console.error(
    "Could not parse __firebase_config. Using empty config. Error: ",
    e
  );
}

export { firebaseConfig };
