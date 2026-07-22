//    Ziba — Firebase config + database helpers

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, collection, addDoc, doc, getDoc, updateDoc, onSnapshot,
    query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD30AKjyl-xMSuH-W62J0251mmimyKZ1Q8",
    authDomain: "ziba-real-estate.firebaseapp.com",
    projectId: "ziba-real-estate",
    storageBucket: "ziba-real-estate.firebasestorage.app",
    appId: "405536277728",
    messagingSenderId: "G-XH6CJP8YBP"  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const APPLICATIONS_COLLECTION = "applications";

/* ---------- Applicant-facing: submit + watch one application ---------- */

async function submitApplication(data) {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

// Live-updates callback(applicationOrNull) whenever the doc changes —
// this is how pending.html reflects an approval without a page refresh.
function watchApplication(applicationId, callback) {
    const ref = doc(db, APPLICATIONS_COLLECTION, applicationId);
    return onSnapshot(ref, (snap) => {
        callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    }, (err) => {
        console.error("watchApplication error:", err);
        callback(null);
    });
}

/* ---------- Admin-facing: queue + approve/reject ---------- */

// Live-updates callback(applicationsArray) with every application still
// awaiting review, newest first.
function watchPendingApplications(callback) {
    const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error("watchPendingApplications error:", err);
        callback([]);
    });
}

async function setApplicationStatus(applicationId, status, reviewerEmail) {
    const ref = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(ref, {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewerEmail || null
    });
}

/* ---------- Admin auth ---------- */

function adminSignIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
function adminSignOut() {
    return signOut(auth);
}
// callback(userOrNull) fires on load and on every sign-in/out.
function watchAdminAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

window.ZibaDB = {
    submitApplication,
    watchApplication,
    watchPendingApplications,
    setApplicationStatus,
    adminSignIn,
    adminSignOut,
    watchAdminAuth
};