import { Paper, Typography, Divider, Grid } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { find, flatten, flow, uniq } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS, FEELING_OF_THE_END } from "shared/constants";

export const IndexHabitsList = ({ habits, date, displayDone = false }) =>
  habits.map(habit => {
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
                  <Grid container spacing={16} style={{ marginTop: "4px" }}>
                    <Grid item xs={7}>
                      <Typography
                        noWrap={true}
                        variant={"subtitle1"}
                        style={{ marginTop: "6px" }}
                      >
                        {habit.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <div style={{ padding: "4px 0px" }} elevation={0}>
                        <IndexFeelings
                          feelings={FEELINGS}
                          selected={feelings ? feelings.feelings : []}
                          onChange={updateFeelings}
                        />
                      </div>
                    </Grid>
                  </Grid>
                  <Divider />
                </Link>
              );
            }}
          </FeelingsProvider>
        )}
      </FirebaseContext.Consumer>
    );
  });
