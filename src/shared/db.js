import firebase from "firebase/app";
import firebaseStore from "firebase/firestore"; /* eslint-disable-line no-unused-vars */
import config from "shared/db.config.json";

firebase.initializeApp(config);

const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

export { db };
