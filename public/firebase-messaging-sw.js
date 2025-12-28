// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/11.3.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.3.1/firebase-messaging-compat.js"
);

//----- nwt account config for development =================
const firebaseConfig = {
  apiKey: "AIzaSyBN1pZqvlwR-0u0xjnCqg5VOB1TxV3EFlA",
  authDomain: "huris-dev.firebaseapp.com",
  projectId: "huris-dev",
  storageBucket: "huris-dev.firebasestorage.app",
  messagingSenderId: "269252481832",
  appId: "1:269252481832:web:1e0c3156f6b412b11eb61d",
  measurementId: "G-TTN71FX1C7",
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
