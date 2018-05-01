const firebase = require("firebase");
require("@firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyAveMFqrsbGoh1vPvMY8gY-exxso56Q8kc",
  authDomain: "changelog-c9533.firebaseapp.com",
  databaseURL: "https://changelog-c9533.firebaseio.com",
  projectId: "changelog-c9533",
  storageBucket: "changelog-c9533.appspot.com",
  messagingSenderId: "24441771726"
});

firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
