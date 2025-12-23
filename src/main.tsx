import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure environment variables are loaded
if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  console.warn('Missing FIREBASE_PROJECT_ID environment variable');
}

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn('Missing GEMINI_API_KEY environment variable');
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
