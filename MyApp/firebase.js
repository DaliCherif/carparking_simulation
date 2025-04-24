// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCzkJnEqWPnX2sIg3YkYSAOj58pwPQ0iAc",
  authDomain: "parkingapp-dali.firebaseapp.com",
  projectId: "parkingapp-dali",
  storageBucket: "parkingapp-dali.appspot.com",
  messagingSenderId: "514605587303",
  appId: "1:514605587303:web:2a54fe2787e852bde06dc2",
  databaseURL: "https://parkingapp-dali-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb };
