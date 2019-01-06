import { List } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { find, flatten, flow, uniq } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexHabitsListItemV3 } from "screens/Index/components/IndexHabitsListItemV3";
import { FEELING_OF_THE_END } from "shared/constants";

export const IndexHabitsList = ({ habits, date }) => (
  <>
    {habits.map(habit => {
      return (
        <FirebaseContext.Consumer key={habit.id}>
          {db => (
            <FeelingsProvider idHabit={habit.id}>
              {props => {
                const { uid } = firebase.auth().currentUser;
                const isFromToday = record =>
                  moment(record.date.toDate()).format("DD/MM/YYYY") ===
                  date.format("DD/MM/YYYY");
                const feelings = flow(
                  props => props.feelings,
                  find(isFromToday)
                )(props);

                const emojis = flow(
                  feelings => (!!feelings ? feelings.feelings : []),
                  flatten,
                  uniq
                )(feelings);

                const updateFeelings = feelingsNew => {
                  const dbFeelingsRef = db.collection("records");
                  if (feelings) {
                    dbFeelingsRef.doc(feelings.id).set({
                      uid,
                      idHabit: habit.id,
                      date: date.toDate(),
                      feelings: feelingsNew
                    });
                  } else {
                    dbFeelingsRef.add({
                      uid,
                      idHabit: habit.id,
                      date: date.toDate(),
                      feelings: feelingsNew
                    });
                  }
                };

                return (
                  <Link key={habit.id} to={`/habits/${habit.id}`}>
                    <IndexHabitsListItemV3
                      habit={habit}
                      updateFeelings={updateFeelings}
                      feelings={feelings}
                    />
                  </Link>
                );
              }}
            </FeelingsProvider>
          )}
        </FirebaseContext.Consumer>
      );
    })}
  </>
);
