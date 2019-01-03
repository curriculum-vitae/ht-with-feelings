import {
  Paper,
  Typography,
  List,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { find, flatten, flow, uniq, map } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS, FEELING_OF_THE_END } from "shared/constants";

const IndexHabitsListItemV1 = ({ habit, feelings, updateFeelings }) => (
  <>
    <Grid container spacing={0} style={{ marginTop: "4px" }}>
      <Grid item xs={7}>
        <Typography noWrap={true} variant={"subtitle1"}>
          {habit.name}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <IndexFeelings
          feelings={FEELINGS}
          selected={feelings ? feelings.feelings : []}
          onChange={updateFeelings}
        />
      </Grid>
    </Grid>
    <Divider />
  </>
);

const IndexHabitsListItemV2 = ({ habit, feelings, updateFeelings }) => (
  <ListItem divider>
    <Avatar>+</Avatar>

    <ListItemText
      primary={habit.name}
      primaryTypographyProps={{
        noWrap: true
      }}
    />
    <ListItemSecondaryAction>
      <IndexFeelings
        feelings={flow(
          feelings => (!!feelings ? feelings.feelings : []),
          uniq
        )(feelings)}
        selected={feelings ? feelings.feelings : []}
        onChange={updateFeelings}
      />
    </ListItemSecondaryAction>
  </ListItem>
);

const IndexHabitsListItemV3 = ({ habit, feelings, updateFeelings }) => (
  <Card style={{ marginBottom: "16px" }} elevation={0}>
    <CardHeader title={habit.name} />

    <CardActions>
      <IndexFeelings
        feelings={FEELINGS}
        selected={feelings ? feelings.feelings : []}
        onChange={updateFeelings}
      />
    </CardActions>
  </Card>
);

export const IndexHabitsList = ({ habits, date, displayDone = false }) => (
  <List>
    {habits.map(habit => {
      return (
        <FirebaseContext.Consumer key={habit.id}>
          {db => (
            <FeelingsProvider idHabit={habit.id}>
              {props => {
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
                  const dbFeelingsRef = db
                    .collection("habits")
                    .doc(habit.id)
                    .collection("feelings");
                  if (feelings) {
                    dbFeelingsRef.doc(feelings.id).set({
                      date: date.toDate(),
                      feelings: feelingsNew
                    });
                  } else {
                    dbFeelingsRef.add({
                      date: date.toDate(),
                      feelings: feelingsNew
                    });
                  }
                };

                return (
                  <Link
                    key={habit.id}
                    to={`/habits/${habit.id}`}
                    style={{
                      display: emojis.includes(FEELING_OF_THE_END)
                        ? displayDone
                          ? undefined
                          : "none"
                        : displayDone
                        ? "none"
                        : undefined
                    }}
                  >
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
  </List>
);
