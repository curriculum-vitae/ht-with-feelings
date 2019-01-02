const config = require("../src/shared/db.config.json");
const firebase = require("firebase/app");
const {
  flow,
  uniq,
  map,
  flatten,
  sortBy,
  replace,
  slice,
  capitalize,
  truncate,
  lowerCase
} = require("lodash/fp");
require("firebase/firestore");

firebase.initializeApp(config);

const db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

const convertNameToID = flow(
  replace(/\s/g)(""),
  lowerCase,
  truncate({
    length: 24,
    separator: ""
  })
);

const LISTS = [
  "daily",
  "weekly",
  "coding",
  "coding",
  "parties",
  "lindy",
  "health",
  "teaching",
  "computer",
  "communication",
  "sleep",
  "learning",
  "environment"
];

const HABBITS = [
  ["Drink more water", ["health"]],
  ["Avoid leg locking", ["health", "coding"]],
  ["No web after 24:00", ["health"]],
  ["Prepare for the next day", ["daily"]],
  ["Perfect week planning", ["weekly"]],
  ["Use Pomodoro", ["health", "coding"]],
  ["No dancing after 1:00", ["parties"]],
  ["Do exercising", ["daily"]],
  ["Do morning routine", ["daily"]],
  ["Do evening routine", ["daily"]],
  ["Avoid head bending", ["lindy"]],
  ["Use malatonin", ["daily"]],
  ["Avoid coffee after 18:00", ["daily"]],
  ["Avoid wasting morning time in bed", ["daily"]],
  ["Avoid wasting evening time in bed", ["daily"]],
  ["Eat nicely", ["daily", "health"]],
  ["Avoid distractions", ["coding"]],
  ["Prepare for teaching", ["weekly", "teaching"]],
  ["Calibrate feelings", ["daily", "health"]],
  ["Reset the kithen", ["environment", "daily"]],
  ["Avoid social networks", ["daily", "computer"]],
  ["Teach positively", ["teaching"]],
  ["Listen more", ["communication"]],
  ["Liste to podcasts", ["sleep", "daily"]],
  ["Brush teeth", ["health"]],
  ["Always understand what I am working on", ["coding"]],
  ["Prefer learning from individuals", ["learning", "computer", "daily"]]
];

const exec = async () => {
  try {
    const lists = flow(
      map(habit => habit[1]),
      flatten,
      uniq
    )(HABBITS);

    await flow(
      map(list =>
        db
          .collection("lists")
          .doc(list)
          .set({
            name: list,
            position: LISTS.indexOf(list)
          })
      ),
      req => Promise.all(req)
    )(lists);

    await flow(
      sortBy(habit => habit[0]),
      map(habit =>
        db
          .collection("habits")
          .doc(convertNameToID(habit[0]))
          .set({
            name: habit[0],
            lists: map(list => db.doc(`lists/${list}`))(habit[1])
          })
      ),
      requests => Promise.all(requests)
    )(HABBITS);
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
};

exec();
