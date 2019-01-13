import { Grid } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { filter, find, flow, map } from "lodash/fp";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { IndexHabitsListItemV3 } from "screens/Index/components/IndexHabitsListItemV3";

const isRecordIsOnDate = date => record =>
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

const isRecordIsWithinWeek = date => record => {
  const dateOfRecord = record.date.toDate().getTime();
  const dateWeekDayFirst = date.clone().startOf("week");
  const dateWeekDayLast = dateWeekDayFirst.clone().add(7, "days");

  return (
    dateWeekDayFirst.toDate().getTime() <= dateOfRecord &&
    dateOfRecord < dateWeekDayLast.toDate().getTime()
  );
};

export const IndexHabitsList = ({ habits, date, records }) => {
  return (
    <Grid container spacing={8}>
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
                  find(isRecordIsOnDate(date))
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
                  const recordsFromPeriod = flow(
                    filter(isRecordIsByHabit(habit.id)),
                    filter(isRecordIsByUser(uid)),
                    filter(isRecordIsWithinWeek(date))
                  )(records);

                  const recordsOfHabitSuccess = flow(filter(isRecordIsSuccess))(
                    recordsFromPeriod
                  );

                  const recordsOfHabitFail = flow(filter(isRecordIsFailure))(
                    recordsFromPeriod
                  );

                  up[uid] =
                    50 +
                    (50 *
                      (recordsOfHabitSuccess.length -
                        recordsOfHabitFail.length)) /
                      COUNT_OF_DAYS;
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
