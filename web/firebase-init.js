import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, setDoc, collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
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