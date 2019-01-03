import {
  Avatar,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { filter, find, flow, map, reverse, sortBy } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import React from "react";
import { HabitAppBar } from "screens/Habit/components/HabitAppBar";
import {
  getPopularityScale,
  getStats,
  getStatsItems
} from "screens/Habit/helpers";
import { FEELING_OF_THE_END } from "shared/constants";

import { RANGE_OF_EMOJI } from "screens/Habit/constants";

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
                      </Grid>
                      <br />
                      <Grid container spacing={40}>
                        {flow(
                          filter(
                            statsItem => statsItem.emoji !== FEELING_OF_THE_END
                          ),
                          map(statsItem => {
                            const size = getPopularityScale(RANGE_OF_EMOJI[0])(
                              RANGE_OF_EMOJI[1]
                            )(statsItem.percentage);
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
                                    paddingTop: `${(RANGE_OF_EMOJI[1] - size) /
                                      2}px`,
                                    height: `${RANGE_OF_EMOJI[1]}px`
                                  }}
                                >
                                  {statsItem.emoji}
                                </div>

                                <Typography
                                  variant={"caption"}
                                  style={{ marginTop: "18px" }}
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
