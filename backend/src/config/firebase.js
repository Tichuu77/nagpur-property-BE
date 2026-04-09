import admin from 'firebase-admin';
import env from './env.js';

let firebaseApp;

const initFirebase = () => {
  try {
    if (!admin.apps.length) {
      if (env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);

        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        console.log('Firebase initialized (service account)');
      } 
      else {
        firebaseApp = admin.initializeApp();
        console.log('Firebase initialized (default credentials)');
      }
    } else {
      firebaseApp = admin.app();
      console.log('Firebase already initialized');
    }

    return firebaseApp;
  } catch (error) {
    console.error('Firebase init error:', error.message);
    process.exit(1);
  }
};

export default initFirebase;