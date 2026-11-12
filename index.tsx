import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker immediately for offline capability and PWA support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Kandungan baharu aplikasi OPR tersedia.');
  },
  onOfflineReady() {
    console.log('Aplikasi OPR sedia untuk digunakan di luar talian (offline).');
  },
});

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
