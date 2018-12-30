import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { find, flow } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

export const IndexHabitsList = ({ habits, date }) => (
  <List>
    {habits.map(habit => {
      return (
        <ListItem
          key={habit.id}
          divider={true}
          component={Link}
          to={`/habits/${habit.id}`}
        >
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

                  const containsFeelings =
                    feelingsRecord &&
                    feelingsRecord.feelings &&
                    feelingsRecord.feelings.length > 0;
                  return (
                    <>
                      <ListItemText
                        primary={
                          <Typography
                            noWrap={true}
                            align={"center"}
                            style={{
                              marginTop: "18px",
                              opacity: containsFeelings ? "0.75" : "1.0",
                              textDecoration: containsFeelings
                                ? "line-through"
                                : undefined
                            }}
                            variant={"h5"}
                          >
                            {habit.name}
                          </Typography>
                        }
                        secondary={
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
                        }
                      />
                      <ListItemSecondaryAction />
                    </>
                  );
                }}
              </FeelingsProvider>
            )}
          </FirebaseContext.Consumer>
        </ListItem>
      );
    })}
  </List>
);
