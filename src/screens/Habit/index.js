import { Button, Chip, Typography, Hidden } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { AuthObserver } from "features/AuthObserver";
import { filter, find, flow, map } from "lodash/fp";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { HabitAppBar } from "screens/Habit/components/HabitAppBar";
import { HabitEmojiList } from "screens/Habit/components/HabitEmojiList";
import { HabitEmojiOverview } from "screens/Habit/components/HabitEmojiOverview";
import {
  getStats,
  getStatsItems,
  isRecordsHasNoFeelings
} from "screens/Habit/helpers";

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
                        {db => (
                          <HabitAppBar
                            habit={habit}
                            onDelete={() => deleteHabit(db)}
                          />
                        )}
                      </FirebaseContext.Consumer>
                      <div
                        style={{
                          padding: "0px 20px"
                        }}
                      >
                        <Typography variant={"h4"}>{habit.name}</Typography>

                        <ListsProvider>
                          {props =>
                            flow(
                              props => props.lists,
                              filter(
                                list =>
                                  !!find(l => l.id === list.id)(habit.lists)
                              ),
                              map(list => (
                                <Typography
                                  key={list.id}
                                  inline
                                  variant={"caption"}
                                  gutterBottom
                                  style={{
                                    marginRight: "10px"
                                  }}
                                >
                                  {list.name}
                                </Typography>
                              ))
                            )(props)
                          }
                        </ListsProvider>

                        <FeelingsProvider idHabit={habit.id}>
                          {props => {
                            const statsItems = flow(
                              props => props.feelings,
                              getStats,
                              getStatsItems
                            )(props);
                            return (
                              <>
                                <br />
                                <br />
                                <Typography variant={"h6"} gutterBottom>
                                  Overview
                                </Typography>
                                {statsItems.length === 0 ? (
                                  <Typography variant={"body2"} gutterBottom>
                                    Nothing to show (yet)
                                  </Typography>
                                ) : (
                                  <>
                                    <HabitEmojiOverview
                                      statsItems={statsItems}
                                    />
                                  </>
                                )}
                              </>
                            );
                          }}
                        </FeelingsProvider>
                        <br />
                        <br />
                        <Typography variant={"h6"} gutterBottom>
                          Log
                        </Typography>
                        <FeelingsProvider idHabit={habit.id}>
                          {props => (
                            <FirebaseContext.Consumer>
                              {db =>
                                isRecordsHasNoFeelings(props.feelings) ? (
                                  <Typography variant={"body2"}>
                                    No records
                                  </Typography>
                                ) : (
                                  <HabitEmojiList
                                    records={props.feelings}
                                    onDelete={({ record, position }) => {
                                      db.collection("records")
                                        .doc(record.id)
                                        .update({
                                          feelings: [
                                            ...record.feelings.slice(
                                              0,
                                              position
                                            ),
                                            ...record.feelings.slice(
                                              position + 1,
                                              record.feelings.length
                                            )
                                          ]
                                        });
                                    }}
                                  />
                                )
                              }
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
        <>
          <br />
          <Typography
            align={"center"}
            style={{ padding: "40px" }}
            variant={"h3"}
          >
            Please log in
          </Typography>
          <br />
          <div
            style={{
              textAlign: "center"
            }}
          >
            <Link to={"/auth"}>
              <Button variant={"contained"}>Log in</Button>
            </Link>
          </div>
        </>
      )
    }
  </AuthObserver>
);
