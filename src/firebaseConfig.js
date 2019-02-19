import firebase from "firebase";
import "firebase/firestore";
import firebaseKeys from "./firebaseKeys";

// firebase init goes here
const config = {
  apiKey: firebaseKeys.apiKey,
  authDomain: firebaseKeys.authDomain,
  databaseURL: firebaseKeys.databaseURL,
  projectId: firebaseKeys.projectId,
  storageBucket: firebaseKeys.storageBucket,
  messagingSenderId: firebaseKeys.messagingSenderId
};
firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
};
