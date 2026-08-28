import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";

// This app is built for one class shared across your own devices — not
// multi-tenant with logins — so everything syncs through a single shared
// document. If you ever need separate classes/accounts, this is the spot
// that would need real authentication added.
const CLOUD_DOC_PATH = ["classroomTracker", "main"];

export function isCloudConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY");
}

let db = null;
if (isCloudConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch {
    db = null;
  }
}

function docRef() {
  return doc(db, ...CLOUD_DOC_PATH);
}

/**
 * Subscribes to a single field within the shared document.
 * Calls back with the remote value whenever it changes (including on
 * first connect). Returns an unsubscribe function.
 */
export function subscribeCloudField(field, onValue, onError) {
  if (!db) return () => {};
  return onSnapshot(
    docRef(),
    (snap) => {
      if (snap.exists()) onValue(snap.data()[field]);
    },
    onError
  );
}

/** Writes a single field into the shared document (merges, doesn't overwrite others). */
export async function saveCloudField(field, value) {
  if (!db) return;
  try {
    await setDoc(docRef(), { [field]: value }, { merge: true });
  } catch {
    // Network hiccup or permissions issue — local storage still has the
    // data, so nothing is lost, it just won't have synced this time.
  }
}
