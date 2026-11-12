import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA installability and offline capability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Kandungan baharu aplikasi OPR tersedia.');
  },
  onOfflineReady() {
    console.log('Aplikasi OPR sedia untuk digunakan di luar talian (offline).');
  },
});

// Explicit service worker fallback registration for mobile browsers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('PWA ServiceWorker registered with scope: ', reg.scope);
    }).catch((err) => {
      console.warn('PWA ServiceWorker fallback registration note: ', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
