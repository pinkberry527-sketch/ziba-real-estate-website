/* ==========================================================
   Ziba — Firebase config + database helpers
   ==========================================================
   1. Create a Firebase project at https://console.firebase.google.com
   2. Enable Firestore Database (production mode) and
      Authentication → Email/Password sign-in.
      (No Cloud Storage needed — the profile photo and ID document are
      compressed and stored as base64 text directly on the application
      document, so this stays entirely on Firestore's free Spark plan.
      No billing card required anywhere in this project.)
   3. Project settings → General → "Your apps" → add a Web app →
      copy the config object it gives you into firebaseConfig below.
   4. Paste the Firestore security rules from the setup guide into
      Firestore → Rules.
   5. Authentication → Users → add yourself and your co-reviewer as
      users (their email + a password you choose) — that's how the
      admin page recognizes who's allowed to approve applications.
   ========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot,
    query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD30AKjyl-xMSuH-W62J0251mmimyKZ1Q8",
    authDomain: "ziba-real-estate.firebaseapp.com",
    projectId: "ziba-real-estate",
    storageBucket: "ziba-real-estate.firebasestorage.app",
    messagingSenderId: "405536277728",
    appId: "1:405536277728:web:e65b01765a799921277c85"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const APPLICATIONS_COLLECTION = "applications";
const USERS_COLLECTION = "users";
const LISTINGS_COLLECTION = "listings";

/* ---------- Applicant-facing: submit + watch one application ---------- */

async function submitApplication(data) {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp()
    });

    // Save the ID on the applicant's own account too, so future lookups
    // (a fresh login on another device, revisiting pending.html) can use a
    // plain single-document get — which security rules can safely scope to
    // "your own record only". A list-query filtered by uid can't be scoped
    // that way in Firestore rules, so we deliberately avoid needing one.
    if (data.uid) {
        await updateDoc(doc(db, USERS_COLLECTION, data.uid), {
            latestApplicationId: docRef.id
        });
    }

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

/* ---------- Admin-facing: queue + approve/reject/suspend ---------- */

// Live-updates callback(applicationsArray) with every application at a
// given status, newest first. This is what powers each tab in admin.html
// (Pending / Approved / Suspended all use the same underlying query shape,
// so they share one Firestore composite index).
function watchApplicationsByStatus(status, callback) {
    const q = query(
        collection(db, APPLICATIONS_COLLECTION),
        where("status", "==", status),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error(`watchApplicationsByStatus(${status}) error:`, err);
        callback([]);
    });
}

// Kept for backwards compatibility with existing calls.
function watchPendingApplications(callback) {
    return watchApplicationsByStatus("pending", callback);
}

async function setApplicationStatus(applicationId, uid, status, reviewerEmail) {
    const appRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(appRef, {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewerEmail || null
    });

    // Keep the applicant's own account in sync so their next login routes
    // them correctly, not just the application record itself.
    if (uid) {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, { agentStatus: status });
    }
}

/* ---------- Real user accounts (buyer / agent) ---------- */

// Creates the Firebase Auth account AND the matching profile doc in one go.
// profile: { fullName, email, role: 'user' | 'agent' }
async function registerUser(email, password, profile) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    await setDoc(doc(db, USERS_COLLECTION, uid), {
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role,
        agentStatus: profile.role === "agent" ? "pending" : null,
        createdAt: serverTimestamp()
    });

    return uid;
}

// Signs in, then returns their profile doc (not just the auth credential) —
// callers need the role/agentStatus to know where to route them.
async function loginUser(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(credential.user.uid);
    return { uid: credential.user.uid, ...profile };
}

async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
    return snap.exists() ? snap.data() : null;
}

function getCurrentUser() {
    return auth.currentUser;
}

function signOutUser() {
    return signOut(auth);
}

// callback(userOrNull) fires on load and on every sign-in/out — used by
// both the admin queue and any page that needs to know who's signed in.
function watchAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}

/* ---------- Admin auth (kept as aliases — admin.html already uses these names) ---------- */

function adminSignIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}
function adminSignOut() {
    return signOut(auth);
}
function watchAdminAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

/* ---------- Property listings ---------- */

async function createListing(data) {
    const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
        ...data,
        views: 0,
        inquiries: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

async function updateListing(listingId, data) {
    await updateDoc(doc(db, LISTINGS_COLLECTION, listingId), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

async function deleteListing(listingId) {
    await deleteDoc(doc(db, LISTINGS_COLLECTION, listingId));
}

// Live-updates callback(listingsArray) with everything the given agent owns,
// newest first — this is what feeds the whole dashboard (stats, tables,
// badge count). Any create/update/delete anywhere just flows back through
// this listener automatically.
function watchAgentListings(uid, callback) {
    const q = query(
        collection(db, LISTINGS_COLLECTION),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error("watchAgentListings error:", err);
        callback([]);
    });
}

// Not wired into any page yet — here for when the public buyer-facing
// property browse page gets built, so listings can be queried without
// needing to be signed in.
function watchActiveListings(callback) {
    const q = query(
        collection(db, LISTINGS_COLLECTION),
        where("status", "==", "Active"),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error("watchActiveListings error:", err);
        callback([]);
    });
}

window.ZibaDB = {
    submitApplication,
    watchApplication,
    watchPendingApplications,
    watchApplicationsByStatus,
    setApplicationStatus,
    createListing,
    updateListing,
    deleteListing,
    watchAgentListings,
    watchActiveListings,
    registerUser,
    loginUser,
    getUserProfile,
    getCurrentUser,
    signOutUser,
    watchAuthState,
    // aliases kept for admin.html
    adminSignIn,
    adminSignOut,
    watchAdminAuth
};