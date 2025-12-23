/**
 * Firebase Configuration & Initialization
 *
 * Sets up Firebase App and initializes required services:
 * - Firestore (database)
 * - Authentication
 * - Cloud Storage
 */

import { initializeApp, type FirebaseApp } from 'firebase/app'

let firebaseApp: FirebaseApp | null = null

/**
 * Initialize Firebase with configuration from environment variables
 *
 * @returns Firebase App instance
 * @throws Error - If required environment variables are missing
 */
export function initializeFirebase(): FirebaseApp {
  // Return existing instance if already initialized
  if (firebaseApp) {
    return firebaseApp
  }

  const firebaseConfig = {
    apiKey: import.meta.env['VITE_FIREBASE_API_KEY'],
    authDomain: import.meta.env['VITE_FIREBASE_AUTH_DOMAIN'],
    projectId: import.meta.env['VITE_FIREBASE_PROJECT_ID'],
    storageBucket: import.meta.env['VITE_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: import.meta.env['VITE_FIREBASE_MESSAGING_SENDER_ID'],
    appId: import.meta.env['VITE_FIREBASE_APP_ID'],
  }

  // Validate required config
  const requiredFields = [
    'projectId',
    'storageBucket',
    'apiKey',
    'authDomain',
    'appId',
  ]

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
  )

  if (missingFields.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missingFields.join(', ')}. ` +
        `Please check your .env file and ensure all VITE_FIREBASE_* variables are set.`
    )
  }

  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig)

  return firebaseApp
}

/**
 * Get the Firebase App instance
 *
 * @returns Firebase App instance (initialized if needed)
 */
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    return initializeFirebase()
  }
  return firebaseApp
}
