import {
  Button,
  ButtonBase,
  Grid,
  List,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  Icon,
  ListItemText,
  Paper,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { filter, flow, find } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import React from "react";
import { Link } from "react-router-dom";

import { IndexAppBarBottom } from "screens/Index/components/IndexAppBarBottom";
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
import { IndexDayPicker } from "screens/Index/components/IndexDayPicker";
import { IndexLists } from "screens/Index/components/IndexLists";
import { FEELINGS } from "shared/constants";

import { ListsProvider } from "providers/ListsProvider";
import { SelectedOnce } from "components/SelectedOnce";

const Feelings = ({ selected = [], onChange }) => (
  <div
    style={{
      display: "flex",
      marginTop: "8px"
    }}
  >
    {FEELINGS.map(icon => (
      <ButtonBase
        size={"small"}
        variant={"outlined"}
        style={{
          opacity: selected.includes(icon) ? "1" : "0.25",
          marginRight: "15px",
          fontSize: "32px",
          flexGrow: "1",
          flexBasis: "0"
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
  </div>
);

const Habits = ({ habits, date }) => (
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
                  return (
                    <>
                      <ListItemText
                        primary={
                          <Typography
                            noWrap={true}
                            align={"center"}
                            style={{
                              marginTop: "18px",
                              opacity: !!feelingsRecord ? "0.33" : "1.0",
                              textDecoration: !!feelingsRecord
                                ? "line-through"
                                : undefined
                            }}
                            variant={"h5"}
                          >
                            {habit.name}
                          </Typography>
                        }
                        secondary={
                          <Feelings
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
      <IndexDayPicker initialDate={moment()}>
        {({ date, setDatePrev, setDateNext }) => (
          <>
            <Grid container>
              <Grid item xs={12}>
                <IndexAppBarTop />
              </Grid>
              <Grid item xs={6} style={{ display: "none" }}>
                <Grid container alignItems={"flex-end"}>
                  <Grid item xs={4}>
                    <IconButton
                      onClick={setDatePrev}
                      style={{ float: "right", marginTop: "8px" }}
                    >
                      <Icon>arrow_left</Icon>
                    </IconButton>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant={"h6"} align={"center"}>
                      {date.format("DD/MM/YY")}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      onClick={setDateNext}
                      style={{ marginTop: "8px" }}
                    >
                      <Icon>arrow_right</Icon>
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <ListsProvider>
              {({ lists }) => (
                <>
                  {lists.length > 0 ? (
                    <SelectedOnce
                      initialSelected={lists[0] ? lists[0].id : undefined}
                    >
                      {({ selected, setSelected }) => (
                        <>
                          <div
                            style={{
                              padding: "20px",
                              width: "100%",
                              maxWidth: "100%",
                              overflow: "auto",
                              whiteSpace: "nowrap",
                              scrollX: "auto"
                            }}
                          >
                            <IndexLists
                              selected={selected}
                              lists={lists}
                              onSelect={id => setSelected(id)}
                            />
                          </div>
                          <HabitsProvider>
                            {props => (
                              <Habits
                                date={date}
                                habits={flow(
                                  props => props.habits,
                                  filter(
                                    habit =>
                                      !!find(list => list.id === selected)(
                                        habit.lists
                                      )
                                  )
                                )(props)}
                              />
                            )}
                          </HabitsProvider>
                        </>
                      )}
                    </SelectedOnce>
                  ) : null}
                </>
              )}
            </ListsProvider>
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
