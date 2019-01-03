import {
  Avatar,
  Chip,
  Grid,
  List,
  IconButton,
  Icon,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction
} from "@material-ui/core";
import { flow, map, slice, find, filter, sortBy, reverse } from "lodash/fp";
import moment from "moment";
import React from "react";
import firebase from "firebase/app";
import { getRandomFontSize } from "shared/helpers";
import {
  generateFakeStats,
  getStats,
  getStatsItems,
  getPopularityScale
} from "screens/Habit/helpers";
import { HabitAppBar } from "screens/Habit/components/HabitAppBar";
import { HabitsProvider } from "providers/HabitsProvider";
import { FirebaseContext } from "contexts/FirebaseContext";

import { FeelingsProvider } from "providers/FeelingsProvider";
import { FEELING_OF_THE_END } from "shared/constants";

export const HabitScreen = ({ match, stats, history }) => (
  <>
    <HabitsProvider>
      {props => {
        const habit = flow(
          props => props.habits,
          find(habit => habit.id === match.params.idHabit)
        )(props);
        if (!habit) return null;

        return (
          <>
            <FirebaseContext.Consumer>
              {db => (
                <HabitAppBar
                  onDelete={() => {
                    db.collection("habits")
                      .doc(habit.id)
                      .delete()
                      .then(() => {
                        history.goBack();
                      })
                      .catch(e => {
                        window.alert("Error");
                      });
                  }}
                />
              )}
            </FirebaseContext.Consumer>
            <div
              style={{
                padding: "0px 20px"
              }}
            >
              <Grid container>
                <Grid item xs={10}>
                  <Typography variant={"h4"} gutterBottom>
                    {habit.name}
                  </Typography>
                </Grid>

                <Grid item xs={2} />
              </Grid>
              <FeelingsProvider idHabit={habit.id}>
                {props => {
                  const stats = getStats(props.feelings);
                  const statsItems = getStatsItems(stats);
                  return (
                    <>
                      <Grid container alignItems={"flex-end"}>
                        <Grid item xs={6}>
                          <Typography variant={"h6"} gutterBottom>
                            Overview
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant={"caption"}
                            gutterBottom
                            style={{ textAlign: "right" }}
                          >
                            {" "}
                            last 21 day
                          </Typography>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={40}>
                        {flow(
                          filter(
                            statsItem => statsItem.emoji !== FEELING_OF_THE_END
                          ),
                          map(statsItem => {
                            const size = getPopularityScale(8)(120)(
                              statsItem.percentage
                            );
                            return (
                              <Grid
                                item
                                xs={4}
                                style={{ textAlign: "center" }}
                                key={statsItem.emoji}
                              >
                                <div
                                  style={{
                                    fontSize: `${size}px`,
                                    paddingTop: `${(120 - size) / 2}px`,
                                    height: "120px"
                                  }}
                                >
                                  {statsItem.emoji}
                                </div>

                                <Typography
                                  variant={"caption"}
                                  style={{ marginTop: "12px" }}
                                >
                                  {String(
                                    (statsItem.percentage * 100) / 1
                                  ).slice(0, 4)}
                                  %
                                </Typography>
                              </Grid>
                            );
                          })
                        )(statsItems)}
                      </Grid>
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
                      <List dense>
                        {flow(
                          props => props.feelings,
                          sortBy(record => record.date.toDate()),
                          reverse,
                          map(record => (
                            <React.Fragment key={record.id}>
                              {flow(
                                record => record.feelings,
                                reverse,
                                map(emoji => (
                                  <ListItem key={Math.random()} divider>
                                    <ListItemAvatar>
                                      <Avatar>{emoji}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={moment(
                                        record.date.toDate()
                                      ).format("DD/MM/YYYY")}
                                    />
                                    <ListItemSecondaryAction
                                      onClick={() => {
                                        db.collection("habits")
                                          .doc(habit.id)
                                          .collection("feelings")
                                          .doc(record.id)
                                          .update({
                                            feelings: firebase.firestore.FieldValue.arrayRemove(
                                              emoji
                                            )
                                          });
                                      }}
                                    >
                                      <IconButton>
                                        <Icon>remove</Icon>
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                ))
                              )(record)}
                            </React.Fragment>
                          ))
                        )(props)}
                      </List>
                    )}
                  </FirebaseContext.Consumer>
                )}
              </FeelingsProvider>
            </div>
          </>
        );
      }}
    </HabitsProvider>
  </>
);
