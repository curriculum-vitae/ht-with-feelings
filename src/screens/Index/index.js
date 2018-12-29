import {
  Button,
  ButtonBase,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { filter, flow, last, find } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { compose, withState } from "recompose";
import { IndexAppBarBottom } from "screens/Index/components/IndexAppBarBottom";
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
import { IndexDayPicker } from "screens/Index/components/IndexDayPicker";
import { IndexLists } from "screens/Index/components/IndexLists";
import { FEELINGS } from "shared/constants";
import { FAKE_LISTS } from "screens/Index/constants";

const Feelings = ({ selected = [], onChange }) => (
  <>
    {FEELINGS.map(icon => (
      <ButtonBase
        size={"small"}
        variant={"outlined"}
        style={{
          borderRadius: "100%",
          opacity: selected.includes(icon) ? "1" : "0.3",
          marginRight: "15px",
          fontSize: "24px"
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.includes(icon)) {
            onChange(flow(filter(item => item !== icon))(selected));
          } else {
            onChange([...selected, icon]);
          }
        }}
        key={icon}
      >
        {icon}
      </ButtonBase>
    ))}
  </>
);

const Habits = ({ habits, date }) => (
  <List>
    {habits.map(habit => (
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
                return (
                  <>
                    <ListItemText
                      primary={
                        <Typography
                          style={{
                            opacity: !!feelingsRecord ? "0.33" : "1.0",
                            textDecoration: !!feelingsRecord
                              ? "line-through"
                              : undefined
                          }}
                          variant={"h6"}
                        >
                          {habit.name}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Feelings
                        selected={feelingsRecord ? feelingsRecord.feelings : []}
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
                    </ListItemSecondaryAction>
                  </>
                );
              }}
            </FeelingsProvider>
          )}
        </FirebaseContext.Consumer>
      </ListItem>
    ))}
  </List>
);

export const IndexScreen = () => (
  <Paper
    elevation={0}
    square
    style={{
      position: "relative",
      minHeight: "100vh"
    }}
  >
    <>
      <IndexAppBarTop />
      <IndexDayPicker initialDate={moment()}>
        {({ date, setDatePrev, setDateNext }) => (
          <>
            <Grid container>
              <Grid item xs={4}>
                <Button onClick={setDatePrev}>PREV</Button>
              </Grid>
              <Grid item xs={4}>
                <Typography variant={"h6"}>
                  {date.format("DD/MM/YY")}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={setDateNext}>NEXT</Button>
              </Grid>
            </Grid>
            <IndexLists selected={"1"} lists={FAKE_LISTS} />
            <HabitsProvider>
              {props => <Habits date={date} habits={props.habits} />}
            </HabitsProvider>
          </>
        )}
      </IndexDayPicker>
    </>
    <br />
    <br />
    <br />
    <br />
    <IndexAppBarBottom />
  </Paper>
);
