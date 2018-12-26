import firebase from "firebase";
import firebaseStore from "firebase/firestore";

var config = {
  apiKey: "AIzaSyCsjCBLm8w2Nj47Z5i75_DyR-YHSFwBNkw",
  authDomain: "habits-with-feelings.firebaseapp.com",
  databaseURL: "https://habits-with-feelings.firebaseio.com",
  projectId: "habits-with-feelings",
  storageBucket: "habits-with-feelings.appspot.com",
  messagingSenderId: "991984396104"
};
firebase.initializeApp(config);

const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

export { db };
