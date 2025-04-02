const admin = require('firebase-admin');

// Load Firebase service account credentials from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

console.log("Service Account Key:", serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
