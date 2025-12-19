const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');

let adminModule = null;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require('./service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  adminModule = admin;
} else {
  console.log('Firebase service account not found - Firebase features will be disabled');
  adminModule = null;
}

module.exports = adminModule;
