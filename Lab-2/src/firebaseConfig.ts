import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCCdkwkvXZ3Asf2Rp5OivDqYOR-VRPDszk",
    authDomain: "playground-4863b.firebaseapp.com",
    databaseURL: "https://playground-4863b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "playground-4863b",
    storageBucket: "playground-4863b.appspot.com",
    messagingSenderId: "764285963865",
    appId: "1:764285963865:web:57d1998230a9dbda0dab48"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
