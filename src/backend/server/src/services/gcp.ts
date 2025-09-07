import { GoogleAuth } from 'google-auth-library';
import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { initializeApp, App } from 'firebase-admin/app';

let cloudBuildClient: CloudBuildClient;
let firebaseApp: App;

async function initializeGCP(): Promise<{cloudBuildClient: CloudBuildClient, firebaseApp: App}> {
  try {
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    cloudBuildClient = new CloudBuildClient({ auth });
    firebaseApp = initializeApp();
    /* CODemod: console.log('GCP services initialized.'); */
    return { cloudBuildClient, firebaseApp };
  } catch (error: any) {
    throw new Error(`GCP initialization failed: ${error.message}`);
  }
}

export async function getCloudBuildClient(): Promise<CloudBuildClient> {
  if (!cloudBuildClient) await initializeGCP();
  return cloudBuildClient;
}

export async function getFirebaseApp(): Promise<App> {
  if (!firebaseApp) await initializeGCP();
  return firebaseApp;
}
