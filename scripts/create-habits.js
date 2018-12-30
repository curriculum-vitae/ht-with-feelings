const config = require("../src/shared/db.config.json");
const firebase = require("firebase/app");
const { flow, uniq, map, flatten } = require("lodash/fp");
require("firebase/firestore");

firebase.initializeApp(config);

const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

const DATA = [
  ["Drink more water", ["health"]],
  ["Avoid leg locking", ["health", "coding"]],
  ["No web after 24:00", ["health"]],
  ["Prepare for the next day", ["daily"]],
  ["Perfect week planning", ["weekly"]]
];

const exec = async () => {
  try {
    const lists = flow(
      map(habit => habit[1]),
      flatten,
      uniq
    )(DATA);

    await flow(
      map(list =>
        db
          .collection("lists")
          .doc(list)
          .set({
            name: list
          })
      ),
      req => Promise.all(req)
    )(lists);

    await flow(
      map(habit =>
        db.collection("habits").add({
          name: habit[0],
          lists: map(list => db.doc(`lists/${list}`))(habit[1])
        })
      ),
      requests => Promise.all(requests)
    )(DATA);
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
};

exec();
