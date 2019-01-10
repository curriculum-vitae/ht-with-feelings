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

const ID_ME = "elYllDGPEAcPpnBAgJkOyPLGdW02";
const ID_MYROSIA = "FjxH8CtpSTNItsM35mOr1R12UYV2";
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

const USERS = [
  {
    name: "RG",
    uid: ID_ME
  },
  {
    name: "Myrosia",
    uid: ID_MYROSIA
  }
];

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
  ["Drink more water", ["consumpting"], [ID_ME, ID_MYROSIA]],
  ["Avoid leg locking", ["sitting", "coding"], [ID_ME]],
  ["No web after 24:00", ["sleeping"], [ID_ME, ID_MYROSIA]],
  ["Prepare for the next day", ["planning"], [ID_ME, ID_MYROSIA]],
  ["Perfect week planning", ["planning"], [ID_ME]],
  ["Write to Notion", ["learning"], [ID_ME]],
  ["Use Pomodoro", ["coding"], [ID_ME]],
  ["No dancing after 1:00", ["dancing"], [ID_ME]],
  ["Do exercising", ["exercising"], [ID_ME, ID_MYROSIA]],
  ["Do the plank", ["exercising"], [ID_ME]],
  ["Do morning routine", ["waking"], [ID_ME]],
  ["Do evening routine", ["sleeping"], [ID_ME]],
  ["Call Pa", ["communicating"], [ID_ME]],
  ["Avoid head bending", ["dancing"], [ID_ME]],
  ["Use malatonin", ["sleeping"], [ID_ME]],
  ["Avoid coffee after 18:00", ["sleeping"], [ID_ME]],
  ["Avoid wasting morning time in bed", ["waking"], [ID_ME]],
  ["Avoid wasting evening time in bed", ["sleeping"], [ID_ME]],
  ["Eat nicely", ["consumpting"], [ID_ME, ID_MYROSIA]],
  ["Avoid distractions", ["coding"], [ID_ME]],
  ["Prepare for teaching", ["planning", "teaching"], [ID_ME]],
  ["Reset the kithen", ["housing"], [ID_ME, ID_MYROSIA]],
  ["Avoid social networks", ["sitting"], [ID_ME]],
  ["Listen more", ["communicating"], [ID_ME]],
  ["Listen more to podcasts", ["sleeping"], [ID_ME]],
  ["Brush teeth", ["sleeping"], [ID_ME, ID_MYROSIA]],
  ["Always understand what I am working on", ["coding"], [ID_ME]],
  ["Prefer learning from individuals", ["learning"], [ID_ME]]
];

const createUsers = async () => {
  return await flow(
    map(user =>
      db
        .collection("users")
        .doc(user.uid)
        .set({
          name: user.name,
          uid: user.uid
        })
    ),
    requests => Promise.all(requests)
  )(USERS);
};

const createLists = async () => {
  const lists = flow(
    map(habit => habit[1]),
    flatten,
    uniq
  )(HABBITS);

  return await flow(
    map(list =>
      db
        .collection("lists")
        .doc(list)
        .set({
          name: list,
          uid: ID_ME,
          position: LISTS.indexOf(list)
        })
    ),
    requests => Promise.all(requests)
  )(lists);
};

const createHabits = async () => {
  return await flow(
    sortBy(habit => habit[0]),
    map(habit =>
      db
        .collection("habits")
        .doc(convertNameToID(habit[0]))
        .set({
          name: habit[0],
          uid: ID_ME,
          uids: habit[2],
          lists: map(list => db.doc(`lists/${list}`))(habit[1])
        })
    ),
    requests => Promise.all(requests)
  )(HABBITS);
};

const runTask = async (name, task) => {
  console.log(`STARTING \t\t ${name}`);
  await task();
  console.log(`ENDING \\t ${name}`);
};

const createAll = async () => {
  try {
    await runTask("LISTS", createLists);
    await runTask("HABITS", createHabits);
    await runTask("USERS", createUsers);

    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
};

createAll();
