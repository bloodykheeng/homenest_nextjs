// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js"
);

//----- homenest kimerafarouk8@gmail.com account config for development =================
const firebaseConfig = {
  apiKey: "AIzaSyB2KaFbWnFzBb87WkU0w-m8RMaerrBHPVY",
  authDomain: "homenest-b5304.firebaseapp.com",
  projectId: "homenest-b5304",
  storageBucket: "homenest-b5304.firebasestorage.app",
  messagingSenderId: "92763941240",
  appId: "1:92763941240:web:1c07f1a0ea9788abeec08d",
  measurementId: "G-7MZR5S7X8Y",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./logos/huris-short-circle-logo.png",
  };

  // // by default if the payload comes with notification key inside firebase will trigger
  // // windows notification automatically but if so u have to remove self.registration
  // // to prevent double or twice notifications
  // // for more info read here
  // // https://stackoverflow.com/questions/66697332/firebase-web-push-notifications-is-triggered-twice-when-using-onbackgroundmessag

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
