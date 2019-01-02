import { Typography, Paper } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { find, flow, map, flatten, uniq } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS, FEELING_OF_THE_END } from "shared/constants";

export const IndexHabitsList = ({ habits, date }) => (
  <div>
    {habits.map(habit => {
      return (
        <FirebaseContext.Consumer>
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

                return (
                  <Link
                    key={habit.id}
                    to={`/habits/${habit.id}`}
                    style={{
                      display: emojis.includes(FEELING_OF_THE_END)
                        ? "none"
                        : undefined
                    }}
                  >
                    <div
                      style={{
                        margin: "30px 0px"
                      }}
                    >
                      <Typography noWrap={true} variant={"h5"} gutterBottom>
                        {habit.name}
                      </Typography>
                      <Paper style={{ padding: "8px 0px" }} elevation={0}>
                        <IndexFeelings
                          feelings={FEELINGS}
                          selected={feelings ? feelings.feelings : []}
                          onChange={feelingsNew => {
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
                          }}
                        />
                      </Paper>
                    </div>
                  </Link>
                );
              }}
            </FeelingsProvider>
          )}
        </FirebaseContext.Consumer>
      );
    })}
  </div>
);
