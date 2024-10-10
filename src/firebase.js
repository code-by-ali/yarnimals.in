import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
	browserLocalPersistence,
	getAuth,
	setPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyC4oD0BP-XBCWcKi8hjyGKB5je7wKIQk3E",
	authDomain: "yarnimals-f9abe.firebaseapp.com",
	projectId: "yarnimals-f9abe",
	storageBucket: "yarnimals-f9abe.appspot.com",
	messagingSenderId: "518662807600",
	appId: "1:518662807600:web:424caef1ebaa50095ecdf5",
	measurementId: "G-KHPGMH60VZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage };
