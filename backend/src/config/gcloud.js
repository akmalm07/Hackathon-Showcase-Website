const files = require('./files')
const admin = require('firebase-admin');

if (!process.env.CLOUD_APPLICATION_CREDENTIALS) 
{
  throw new Error('CLOUD_APPLICATION_CREDENTIALS is not set in .env');
}


const serviceAccountCredentials = JSON.parse(
  files.fs.readFileSync(process.env.CLOUD_APPLICATION_CREDENTIALS, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCredentials),
  storageBucket: process.env.CLOUD_STORAGE_BUCKET,
});

module.exports.firestore = admin.firestore();

module.exports.firestoreTimestamp = admin.firestore.Timestamp;

module.exports.firestoreAddValue = admin.firestore.FieldValue;

module.exports.bucket = admin.storage().bucket();

module.exports.uploadPath = 'uploads/';

module.exports.apiRoutes = {
  faq: '/api/faq',
  chat: '/api/chat',
  frontend: '/'
};

module.exports.collections = {
  promptEngineering: module.exports.firestore.collection('prompt-engineering'),
  chatHistory: module.exports.firestore.collection('chat-history'),
};