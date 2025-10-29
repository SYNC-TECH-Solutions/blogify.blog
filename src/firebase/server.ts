
import { initializeApp, getApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

interface FirebaseAdminServices {
  app: App;
  firestore: Firestore;
  auth: Auth;
}

// This function initializes and returns the Firebase Admin SDK services.
// It ensures that initialization only happens once.
export function initializeFirebase(): FirebaseAdminServices {
  if (getApps().length > 0) {
    const app = getApp();
    return {
      app,
      firestore: getFirestore(app),
      auth: getAuth(app),
    };
  }

  // The service account key is a JSON string stored in an environment variable.
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountString) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    return {
      app,
      firestore: getFirestore(app),
      auth: getAuth(app),
    };
  } catch (error: any) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize Firebase Admin SDK:', error);
    throw new Error('Firebase Admin SDK initialization failed.');
  }
}
