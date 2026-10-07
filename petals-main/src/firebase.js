import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCaR7bUgDObFNSVcg3aHc2Rth37i44MA_4",
  authDomain: "muthuspetals-53912.firebaseapp.com",
  projectId: "muthuspetals-53912",
  storageBucket: "muthuspetals-53912.firebasestorage.app",
  messagingSenderId: "378275326997",
  appId: "1:378275326997:web:ad1222c136519e4349721c",
  measurementId: "G-K01V1SEQC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (vapidKey) => {
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
