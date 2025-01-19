import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// // Register Firebase Service Worker
// if ('serviceWorker' in navigator) {
//   console.log('Registering service worker');
  
//   navigator.serviceWorker
//     .getRegistrations()
//     .then((registrations) => {
//       // Unregister all previous service workers
//       registrations.forEach((registration) => {
//         registration.unregister();
//       });
//     })
//     .then(() => {
//       navigator.serviceWorker
//         .register('/firebase-messaging-sw.js', { scope: '/' })
//         .then((registration) => {
//           console.log('Service Worker registered:', registration);
//         })
//         .catch((error) => {
//           console.error('Service Worker registration failed:', error);
//         });
//     });
// }


const root = createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
