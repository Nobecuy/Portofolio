import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Ganti dengan config Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyCaAz5OInsYTbl25VkVPcHrVSGZV_SVDcg",
  authDomain: "portofolio-2bbf8.firebaseapp.com",
  projectId: "portofolio-2bbf8",
  storageBucket: "portofolio-2bbf8.firebasestorage.app",
  messagingSenderId: "146496067270",
  appId: "1:146496067270:web:2c26ae797745cfe57e69c7",
  measurementId: "G-2M03MD1LPY",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Projects Service
export const projectsService = {
  // Get all projects
  getAll: async () => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Add project
  add: async (data) => {
    return await addDoc(collection(db, "projects"), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  // Update project
  update: async (id, data) => {
    const ref = doc(db, "projects", id);
    return await updateDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete project
  delete: async (id) => {
    return await deleteDoc(doc(db, "projects", id));
  },
};

// Progress Service
export const progressService = {
  // Get all progress
  getAll: async () => {
    const q = query(collection(db, "progress"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Real-time listener
  onProgressChange: (callback) => {
    const q = query(collection(db, "progress"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },

  // Add progress
  add: async (data) => {
    return await addDoc(collection(db, "progress"), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },

  // Update progress
  update: async (id, data) => {
    const ref = doc(db, "progress", id);
    return await updateDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete progress
  delete: async (id) => {
    return await deleteDoc(doc(db, "progress", id));
  },
};

// Auth Service
export const authService = {
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
};

// Page Content Service
export const pageContentService = {
  // Get all page content
  getAll: async () => {
    const docRef = doc(db, "pageContent", "portfolio");
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  },

  // Update page content
  update: async (data) => {
    const docRef = doc(db, "pageContent", "portfolio");
    return await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },
};

// Storage Service
export const storageService = {
  // Upload image
  uploadImage: async (file, path) => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  // Delete image
  deleteImage: async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },
};
