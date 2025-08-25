const fs = require("fs");
const admin = require("firebase-admin");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!process.env.GCLOUD_APPLICATION_CREDENTIALS) 
{
  throw new Error("GCLOUD_APPLICATION_CREDENTIALS is not set in .env");
}


const serviceAccountCredentials = JSON.parse(
  fs.readFileSync(process.env.GCLOUD_APPLICATION_CREDENTIALS, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCredentials),
  storageBucket: process.env.GCLOUD_STORAGE_BUCKET,
});

module.exports.firestore = admin.firestore();
module.exports.bucket = admin.storage().bucket();

module.exports.uploadPath = "uploads/";

module.exports.apiRoutes = {
  faq: "/api/faq",
  promptEngineering: "/api/prompt-engineering",
  chat: "/api/chat",
};

module.exports.collections = {
  promptEngineering: module.exports.firestore.collection("prompt-engineering"),
  chatHistory: module.exports.firestore.collection("chat-history"),
};