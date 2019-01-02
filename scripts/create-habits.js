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
  "waking",
  "consumpting",
  "exercising",
  "coding",
  "planning",
  "teaching",
  "sitting",
  "communicating",

  "sleeping",
  "learning",
  "housing",
  "dancing"
];

const HABBITS = [
  ["Drink more water", ["consumpting"]],
  ["Avoid leg locking", ["sitting", "coding"]],
  ["No web after 24:00", ["sleeping"]],
  ["Prepare for the next day", ["planning"]],
  ["Perfect week planning", ["planning"]],
  ["Write to Notion", ["learning"]],
  ["Use Pomodoro", ["coding"]],
  ["No dancing after 1:00", ["dancing"]],
  ["Do misc exercising", ["exercising"]],
  ["Do the plank", ["exercising"]],
  ["Do morning routine", ["waking"]],
  ["Do evening routine", ["sleeping"]],
  ["Call Pa", ["communicating"]],
  ["Avoid head bending", ["dancing"]],
  ["Use malatonin", ["sleeping"]],
  ["Avoid coffee after 18:00", ["sleeping"]],
  ["Avoid wasting morning time in bed", ["waking"]],
  ["Avoid wasting evening time in bed", ["sleeping"]],
  ["Eat nicely", ["consumpting"]],
  ["Avoid distractions", ["coding"]],
  ["Prepare for teaching", ["planning", "teaching"]],
  ["Reset the kithen", ["housing"]],
  ["Avoid social networks", ["sitting"]],
  ["Listen more", ["communicating"]],
  ["Listen more to podcasts", ["sleeping"]],
  ["Brush teeth", ["sleeping"]],
  ["Always understand what I am working on", ["coding"]],
  ["Prefer learning from individuals", ["learning"]]
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
