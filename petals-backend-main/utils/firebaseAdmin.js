import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let messaging;

try {
  const serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, '../muthuspetals-53912-039e9cb933c5.json'), 'utf8')
  );

  if (getApps().length === 0) {
    const app = initializeApp({
      credential: cert(serviceAccount)
    });
    messaging = getMessaging(app);
    console.log("Firebase Admin initialized successfully.");
  } else {
    messaging = getMessaging();
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export { messaging };
