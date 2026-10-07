importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
const firebaseConfig = {
  apiKey: "AIzaSyCaR7bUgDObFNSVcg3aHc2Rth37i44MA_4",
  authDomain: "muthuspetals-53912.firebaseapp.com",
  projectId: "muthuspetals-53912",
  storageBucket: "muthuspetals-53912.firebasestorage.app",
  messagingSenderId: "378275326997",
  appId: "1:378275326997:web:ad1222c136519e4349721c",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
