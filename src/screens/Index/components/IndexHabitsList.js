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
                const feelingsRecord = flow(
                  props => props.feelings,
                  find(
                    feelingsRecord =>
                      moment(feelingsRecord.date.toDate()).format(
                        "DD/MM/YYYY"
                      ) === date.format("DD/MM/YYYY")
                  )
                )(props);
                const emojis = flow(
                  props => props.feelings,
                  map(record => record.feelings),
                  flatten,
                  uniq
                )(props);
                const containsFeelings =
                  feelingsRecord &&
                  feelingsRecord.feelings &&
                  feelingsRecord.feelings.length > 0;
                return (
                  <Link key={habit.id} to={`/habits/${habit.id}`}>
                    <Paper
                      style={{ padding: "8px 0px", margin: "16px 0px" }}
                      elevation={0}
                    >
                      <div
                        style={{
                          display: emojis.includes(FEELING_OF_THE_END)
                            ? "none"
                            : undefined,
                          marginTop: "12px"
                        }}
                      >
                        <Typography
                          align={"center"}
                          noWrap={true}
                          variant={"h5"}
                          gutterBottom
                        >
                          {habit.name}
                        </Typography>
                        <IndexFeelings
                          feelings={FEELINGS}
                          selected={
                            feelingsRecord ? feelingsRecord.feelings : []
                          }
                          onChange={feelingsNew => {
                            const dbFeelingsRef = db
                              .collection("habits")
                              .doc(habit.id)
                              .collection("feelings");
                            if (feelingsRecord) {
                              dbFeelingsRef.doc(feelingsRecord.id).set({
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
                      </div>
                    </Paper>
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
