import { Grid } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { find, flow, map, filter } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexHabitsListItemV3 } from "screens/Index/components/IndexHabitsListItemV3";

const isRecordsIsFromDate = date => record =>
  moment(record.date.toDate()).format("DD/MM/YYYY") ===
  date.format("DD/MM/YYYY");

const isRecordIsByHabit = idHabit => record => record.idHabit === idHabit;

export const IndexHabitsList = ({ habits, date, records }) => {
  return (
    <Grid container spacing={16}>
      {flow(
        map(habit => {
          return (
            <FirebaseContext.Consumer key={habit.id}>
              {db => {
                const { uid } = firebase.auth().currentUser;

                const record = flow(
                  filter(isRecordIsByHabit(habit.id)),
                  find(isRecordsIsFromDate(date))
                )(records);

                const createOnChangeHabitEmojis = idHabit => emojis => {
                  const ref = db.collection("records");
                  const data = {
                    uid,
                    idHabit,
                    date: date.toDate(),
                    feelings: emojis
                  };
                  if (record) {
                    ref.doc(record.id).set(data);
                  } else {
                    ref.add(data);
                  }
                };
                const userProgress = habit.uids.reduce((up, uid) => {
                  up[uid] = Math.random() * 100;
                  return up;
                }, {});
                return (
                  <Grid item xs={12} key={habit.id}>
                    <Link to={`/habits/${habit.id}`}>
                      <IndexHabitsListItemV3
                        habit={habit}
                        record={record}
                        userProgress={userProgress}
                        onChangeHabitEmojis={createOnChangeHabitEmojis(
                          habit.id
                        )}
                      />
                    </Link>
                  </Grid>
                );
              }}
            </FirebaseContext.Consumer>
          );
        })
      )(habits)}
    </Grid>
  );
};
