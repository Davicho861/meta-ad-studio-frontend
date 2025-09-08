"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudBuildClient = getCloudBuildClient;
exports.getFirebaseApp = getFirebaseApp;
const google_auth_library_1 = require("google-auth-library");
const cloudbuild_1 = require("@google-cloud/cloudbuild");
const app_1 = require("firebase-admin/app");
let cloudBuildClient;
let firebaseApp;
async function initializeGCP() {
    try {
        const auth = new google_auth_library_1.GoogleAuth({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });
        cloudBuildClient = new cloudbuild_1.CloudBuildClient({ auth });
        firebaseApp = (0, app_1.initializeApp)();
        /* CODemod: console.log('GCP services initialized.'); */
        return { cloudBuildClient, firebaseApp };
    }
    catch (error) {
        throw new Error(`GCP initialization failed: ${error.message}`);
    }
}
async function getCloudBuildClient() {
    if (!cloudBuildClient)
        await initializeGCP();
    return cloudBuildClient;
}
async function getFirebaseApp() {
    if (!firebaseApp)
        await initializeGCP();
    return firebaseApp;
}
