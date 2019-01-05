import { Typography } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { find, flow } from "lodash/fp";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import React from "react";
import { HabitAppBar } from "screens/Habit/components/HabitAppBar";
import { HabitEmojiOverview } from "screens/Habit/components/HabitEmojiOverview";
import { getStats, getStatsItems } from "screens/Habit/helpers";
//
import { HabitEmojiList } from "screens/Habit/components/HabitEmojiList";
import { AuthObserver } from "features/AuthObserver";

export const HabitScreen = ({ match, history }) => (
  <AuthObserver>
    {({ isSignedIn }) =>
      isSignedIn ? (
        <HabitsProvider>
          {props => {
            const habit = flow(
              props => props.habits,
              find(habit => habit.id === match.params.idHabit)
            )(props);
            if (!habit) return null;

            const deleteHabit = db => {
              db.collection("habits")
                .doc(habit.id)
                .delete()
                .then(() => {
                  history.goBack();
                })
                .catch(e => {
                  window.alert("Error");
                });
            };
            return (
              <AuthObserver>
                {({ isSignedIn }) =>
                  isSignedIn ? (
                    <>
                      <FirebaseContext.Consumer>
                        {db => <HabitAppBar onDelete={() => deleteHabit(db)} />}
                      </FirebaseContext.Consumer>
                      <div
                        style={{
                          padding: "0px 20px"
                        }}
                      >
                        <Typography variant={"h4"} gutterBottom>
                          {habit.name}
                        </Typography>

                        <FeelingsProvider idHabit={habit.id}>
                          {props => {
                            return (
                              <>
                                <Typography variant={"h6"} gutterBottom>
                                  Overview
                                </Typography>
                                <br />
                                <HabitEmojiOverview
                                  statsItems={flow(
                                    props => props.feelings,
                                    getStats,
                                    getStatsItems
                                  )(props)}
                                />
                              </>
                            );
                          }}
                        </FeelingsProvider>
                        <Typography variant={"h6"} gutterBottom>
                          Log
                        </Typography>
                        <FeelingsProvider idHabit={habit.id}>
                          {props => (
                            <FirebaseContext.Consumer>
                              {db => (
                                <HabitEmojiList
                                  records={props.feelings}
                                  onDelete={({ record, emoji }) => {
                                    db.collection("records")
                                      .doc(record.id)
                                      .update({
                                        feelings: firebase.firestore.FieldValue.arrayRemove(
                                          emoji
                                        )
                                      });
                                  }}
                                />
                              )}
                            </FirebaseContext.Consumer>
                          )}
                        </FeelingsProvider>
                      </div>
                    </>
                  ) : null
                }
              </AuthObserver>
            );
          }}
        </HabitsProvider>
      ) : (
        "Please sign in"
      )
    }
  </AuthObserver>
);
