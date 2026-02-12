import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase
// Ve a Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyBCGEZn0xPqHymXAgHsSco-3t9nOE--xjI",
  authDomain: "dj-tracca.firebaseapp.com",
  projectId: "dj-tracca",
  storageBucket: "dj-tracca.firebasestorage.app",
  messagingSenderId: "834742308261",
  appId: "1:834742308261:web:49a8aa9ec300120a97ac4c",
  measurementId: "G-2QNH9WRESS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase (solo los gratuitos)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
