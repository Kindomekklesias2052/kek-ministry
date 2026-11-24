import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuNJ180UReiuc0dVnKZZLbX-1toT-ndxc",
  authDomain: "kek-ministry.firebaseapp.com",
  projectId: "kek-ministry",
  storageBucket: "kek-ministry.firebasestorage.app",
  messagingSenderId: "15927753994",
  appId: "1:15927753994:web:7d69fa0265db48ddfd4ef3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Generate branded KEK Membership ID (e.g., KEK-2026-4829)
function generateKEKId() {
  const year = new Date().getFullYear();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return `KEK-${year}-${randomCode}`;
}

// Write immutable entry to kek_audit_logs
async function writeAuditLog(actorUid, kekId, actionType, targetId, details) {
  try {
    await addDoc(collection(db, "kek_audit_logs"), {
      actor_uid: actorUid,
      kek_id: kekId,
      action_type: actionType,
      target_id: targetId,
      details: details,
      timestamp: serverTimestamp(),
      client_time_iso: new Date().toISOString()
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

// Ensure member profile exists in Firestore and return it
async function ensureMemberProfile(user, extraData = {}) {
  const memberRef = doc(db, "members", user.uid);
  const snap = await getDoc(memberRef);

  if (!snap.exists()) {
    const newKekId = generateKEKId();
    const profile = {
      uid: user.uid,
      kek_id: newKekId,
      full_name: extraData.full_name || user.displayName || "Kingdom Citizen",
      email: user.email || "",
      whatsapp: extraData.whatsapp || "",
      country: extraData.country || "Kenya",
      office_role: extraData.office_role || "Ekklesia Member & Watchman",
      role: "member",
      joined_at: serverTimestamp()
    };
    await setDoc(memberRef, profile);
    await writeAuditLog(user.uid, newKekId, "MEMBER_REGISTERED", newKekId, `Account initialized for ${profile.full_name}`);
    return profile;
  }

  return snap.data();
}

export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  ensureMemberProfile,
  writeAuditLog
};
