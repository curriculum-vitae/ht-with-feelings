import { Grid } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { find, flow, map, filter } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexHabitsListItemV3 } from "screens/Index/components/IndexHabitsListItemV3";
import { FEELING_OF_THE_END } from "shared/constants";

const isRecordIsFromDate = date => record =>
  moment(record.date.toDate()).format("DD/MM/YYYY") ===
  date.format("DD/MM/YYYY");

const isRecordIsByHabit = idHabit => record => record.idHabit === idHabit;

const isRecordIsByUser = uid => record => record.uid === uid;

const isRecordIsSuccess = record => {
  return !!record && record.feelings.includes(`👍`);
};

const isRecordIsFailure = record => {
  return !!record && record.feelings.includes(`👎`);
};

const isRecordIsDateAfter = date => record =>
  record.date.toDate().getTime() > date.getTime();

export const IndexHabitsList = ({ habits, date, records }) => {
  return (
    <Grid container spacing={16}>
      {flow(
        map(habit => {
          return (
            <FirebaseContext.Consumer key={habit.id}>
              {db => {
                const { uid } = firebase.auth().currentUser;
                const COUNT_OF_DAYS = 7;
                const recordFromViewDate = flow(
                  filter(isRecordIsByUser(uid)),
                  filter(isRecordIsByHabit(habit.id)),
                  find(isRecordIsFromDate(date))
                )(records);

                const createOnChangeHabitEmojis = idHabit => emojis => {
                  const ref = db.collection("records");
                  const data = {
                    uid,
                    idHabit,
                    date: date.toDate(),
                    feelings: emojis
                  };
                  if (recordFromViewDate) {
                    ref.doc(recordFromViewDate.id).set(data);
                  } else {
                    ref.add(data);
                  }
                };
                const userProgress = habit.uids.reduce((up, uid) => {
                  const recordsOfHabitAll = flow(
                    filter(isRecordIsByHabit(habit.id)),
                    filter(isRecordIsByUser(uid)),
                    filter(
                      isRecordIsDateAfter(
                        new Date(new Date().setHours(-1 * 24 * COUNT_OF_DAYS))
                      )
                    )
                  )(records);

                  const recordsOfHabitDone = flow(filter(isRecordIsSuccess))(
                    recordsOfHabitAll
                  );

                  up[uid] = (100 * recordsOfHabitDone.length) / COUNT_OF_DAYS;
                  return up;
                }, {});
                return (
                  <Grid item xs={12} key={habit.id}>
                    <Link to={`/habits/${habit.id}`}>
                      <IndexHabitsListItemV3
                        habit={habit}
                        record={recordFromViewDate}
                        isDone={isRecordIsSuccess(recordFromViewDate)}
                        isFailure={isRecordIsFailure(recordFromViewDate)}
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
