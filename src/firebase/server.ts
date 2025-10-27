
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// It's crucial to check if the app is already initialized to avoid errors.
if (!getApps().length) {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const firestore = getFirestore();
const auth = getAuth();

export { firestore, auth };
