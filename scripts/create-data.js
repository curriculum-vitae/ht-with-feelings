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

const getHabitID = flow(
  replace(/\s/g)(""),
  lowerCase,
  truncate({
    length: 24,
    separator: ""
  })
);

const getRecordID = uid => habit => date => {
  return `${uid}${getHabitID(
    habit
  )}${date.getYear()}${date.getMonth()}${date.getDate()}`;
};

const NUMBER_OF_FAKE_HISTORY_DATES = 5;

const USERS = [
  {
    name: "RG",
    uid: ID_ME,
    linkToAvatar:
      "https://lh5.googleusercontent.com/-TnLEmGSBu_0/AAAAAAAAAAI/AAAAAAAARRc/0sFcfNvGcRg/photo.jpg=s32-cc"
  },
  {
    name: "Myrosia",
    uid: ID_MYROSIA,
    linkToAvatar:
      "https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-1/p100x100/27332495_1573034896078295_1116078356954396973_n.jpg?_nc_cat=102&_nc_ht=scontent-waw1-1.xx&oh=f5b740c239774d8c925cc3ec6dabae09&oe=5CBA8F0D"
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

const HABITS = [
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

const getRandomEmojis = () => {
  if (Math.random() > 0.6) return ["👍"];
  if (Math.random() > 0.5) return ["👎"];
  return [];
};

const createRecords = async () => {
  const requests = [];
  USERS.forEach(user => {
    const habits = HABITS.filter(habit => habit[2].includes(user.uid));

    habits.forEach(habit => {
      [...new Array(NUMBER_OF_FAKE_HISTORY_DATES)].forEach((v, index) => {
        const date = new Date(new Date().setHours(-1 * 24 * index));
        const request = db
          .collection("records")
          .doc(getRecordID(user.uid)(habit)(date))
          .set({
            date,
            uid: user.uid,
            idHabit: getHabitID(habit[0]),
            feelings: getRandomEmojis()
          });

        requests.push(request);
      });
    });
  });
  return await Promise.all(requests);
};

const createUsers = async () => {
  return await flow(
    map(user =>
      db
        .collection("users")
        .doc(user.uid)
        .set(user)
    ),
    requests => Promise.all(requests)
  )(USERS);
};

const createLists = async () => {
  const lists = flow(
    map(habit => habit[1]),
    flatten,
    uniq
  )(HABITS);

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
        .doc(getHabitID(habit[0]))
        .set({
          name: habit[0],
          uid: ID_ME,
          uids: habit[2],
          lists: map(list => db.doc(`lists/${list}`))(habit[1])
        })
    ),
    requests => Promise.all(requests)
  )(HABITS);
};

const runTask = async (name, task) => {
  console.log(`${name} --> START`);
  await task();
  console.log(`${name} --> END`);
};

const createAll = async () => {
  try {
    await runTask("LISTS", createLists);
    await runTask("HABITS", createHabits);
    await runTask("USERS", createUsers);
    await runTask("RECORDS", createRecords);

    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
};

createAll();
