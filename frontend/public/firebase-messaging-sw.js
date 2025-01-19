// // firebase-messaging-sw.js

// try {
//     importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
//     importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');
//   } catch (error) {
//     console.error('Failed to load Firebase scripts:', error);
//   }
  

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

// console.log("this is sw config ", firebaseConfig);


// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
