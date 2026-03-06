// Firebase Configuration (Compat SDK)
const firebaseConfig = {
  apiKey:            "AIzaSyBrRYcCZXuVz6sX-nKnWs7SaPXirNymlF8",
  authDomain:        "phinex-b5823.firebaseapp.com",
  databaseURL:       "https://phinex-b5823-default-rtdb.firebaseio.com",
  projectId:         "phinex-b5823",
  storageBucket:     "phinex-b5823.firebasestorage.app",
  messagingSenderId: "481103836570",
  appId:             "1:481103836570:web:2b9f7e8041e0c885d3b623",
  measurementId:     "G-CB05BGEE7L"
};

// Initialize Firebase (with Compat SDK)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}