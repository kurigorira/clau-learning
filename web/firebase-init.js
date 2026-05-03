import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, setDoc, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVjadeeTHVncMklc-g-cDDJYlPxDs9Rac",
  authDomain: "math-saya.firebaseapp.com",
  projectId: "math-saya",
  storageBucket: "math-saya.firebasestorage.app",
  messagingSenderId: "78118196039",
  appId: "1:78118196039:web:71b1d03bc4c01dc653b262",
  measurementId: "G-RD1VWS39B6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function initAuth() {
  await signInAnonymously(auth);
}

export async function saveSessionSummary({ studentId, studentName, startedAt, endedAt, solved, correct, currentLevel }) {
  const sessionRef = doc(collection(db, "students", studentId, "sessions"));
  await setDoc(sessionRef, {
    studentId,
    studentName,
    startedAt,
    endedAt,
    solved,
    correct,
    currentLevel,
    createdAt: serverTimestamp()
  });
}

export async function saveAnswerEvent({ studentId, level, qid, selectedIndex, correct }) {
  await addDoc(collection(db, "students", studentId, "events"), {
    level,
    qid,
    selectedIndex,
    correct,
    answeredAt: serverTimestamp()
  });
}