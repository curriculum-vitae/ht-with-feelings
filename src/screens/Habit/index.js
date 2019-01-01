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
  Typography
} from "@material-ui/core";
import { flow, map, slice, find } from "lodash/fp";
import moment from "moment";
import React from "react";

import { getRandomFontSize } from "shared/helpers";
import {
  generateFakeStats,
  getStats,
  getStatsItems
} from "screens/Habit/helpers";
import { HabitAppBar } from "screens/Habit/components/HabitAppBar";
import { HabitsProvider } from "providers/HabitsProvider";
import { FirebaseContext } from "contexts/FirebaseContext";

import { FeelingsProvider } from "providers/FeelingsProvider";

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
                          map(statsItem => (
                            <Grid
                              item
                              xs={4}
                              style={{ textAlign: "center" }}
                              key={statsItem.emoji}
                            >
                              <div
                                style={{
                                  fontSize: `${getRandomFontSize()}px`,
                                  height: "80px"
                                }}
                              >
                                {statsItem.emoji}
                              </div>
                              <Typography>{statsItem.count}</Typography>
                            </Grid>
                          ))
                        )(statsItems)}
                      </Grid>
                    </>
                  );
                }}
              </FeelingsProvider>
              <Typography variant={"h6"} gutterBottom>
                Log
              </Typography>
              <List dense>
                {flow(
                  generateFakeStats,
                  map(stat => (
                    <ListItem key={Math.random()}>
                      <ListItemAvatar>
                        <Avatar>{stat.feelings[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={moment(stat.dates[0]).format(
                          "DD/MM/YYYY, HH:mm"
                        )}
                      />
                    </ListItem>
                  ))
                )(0)}
              </List>
            </div>
          </>
        );
      }}
    </HabitsProvider>
  </>
);
