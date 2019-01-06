import {
  Button,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Paper,
  Typography
} from "@material-ui/core";
import { SelectedOnce } from "components/SelectedOnce";
import { Toggler } from "components/Toggler";
import { AuthObserver } from "features/AuthObserver";
import { filter, flow, map, noop, find } from "lodash/fp";
import moment from "moment";
import { HabitsProvider } from "providers/HabitsProvider";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
import { Redirect } from "react-router-dom";
import { IndexAppBarBottom } from "screens/Index/components/IndexAppBarBottom";
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
import { IndexDayPicker } from "screens/Index/components/IndexDayPicker";
import { IndexHabitsList } from "screens/Index/components/IndexHabitsList";
import { IndexLists } from "screens/Index/components/IndexLists";
import { isHabitIsFromList } from "shared/helpers";
import { RecordsProvider } from "providers/RecordsProvider";
import { FEELING_OF_THE_END } from "shared/constants";

const IndexListsWrapper = ({ children }) => (
  <div
    children={children}
    style={{
      width: "100%",
      maxWidth: "100%",
      overflow: "auto",
      whiteSpace: "nowrap",
      scrollX: "auto",
      padding: "0px 16px",
      height: "50px"
    }}
  />
);

const IndexHabitsListWrapper = ({ children }) => (
  <div
    style={{
      padding: "0px 20px"
    }}
    children={children}
  />
);

export const IndexScreen = () => (
  <div
    style={{
      position: "relative",
      minHeight: "100vh"
    }}
  >
    <>
      <AuthObserver>
        {({ isSignedIn, loading }) =>
          loading ? (
            <Paper style={{ height: "100vh", padding: "50% 50%" }}>
              <CircularProgress />
            </Paper>
          ) : isSignedIn ? (
            <IndexDayPicker initialDate={moment()}>
              {({ date, setDatePrev, setDateNext }) => (
                <>
                  <IndexAppBarTop />
                  <Grid container style={{ display: "none" }}>
                    <Grid item xs={6}>
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
                      <SelectedOnce initialSelected={"all"}>
                        {({ selected, setSelected }) => (
                          <RecordsProvider>
                            {({ records }) => (
                              <>
                                <HabitsProvider>
                                  {props => {
                                    const filterHabitsByList = selected => habits => {
                                      return selected === "all"
                                        ? habits
                                        : filter(isHabitIsFromList(selected))(
                                            habits
                                          );
                                    };
                                    const findActualHabitRecord = date => idHabit => records => {
                                      return flow(
                                        filter(record => {
                                          return record.idHabit === idHabit;
                                        }),
                                        find(record => {
                                          const FORMAT = "DD/MM/YY";
                                          return (
                                            moment(record.date.toDate()).format(
                                              FORMAT
                                            ) === date.format(FORMAT)
                                          );
                                        })
                                      )(records);
                                    };

                                    const isHabitIsDoneForThisDate = date => idHabit => records => {
                                      const record = findActualHabitRecord(
                                        date
                                      )(idHabit)(records);
                                      return (
                                        !!record &&
                                        !!record.feelings &&
                                        !!record.feelings.includes(
                                          FEELING_OF_THE_END
                                        )
                                      );
                                    };

                                    const habitsCurrentUnfinishedByList = idList =>
                                      flow(
                                        props => props.habits,
                                        filterHabitsByList(idList),
                                        filter(
                                          habit =>
                                            !isHabitIsDoneForThisDate(date)(
                                              habit.id
                                            )(records)
                                        )
                                      )(props);

                                    const habitsCurrentFinishedByList = idList =>
                                      flow(
                                        props => props.habits,
                                        filterHabitsByList(idList),
                                        filter(habit =>
                                          isHabitIsDoneForThisDate(date)(
                                            habit.id
                                          )(records)
                                        )
                                      )(props);

                                    const getListProgress = idList => {
                                      return (
                                        (100 *
                                          habitsCurrentFinishedByList(idList)
                                            .length) /
                                        (habitsCurrentUnfinishedByList(idList)
                                          .length +
                                          habitsCurrentFinishedByList(idList)
                                            .length)
                                      );
                                    };
                                    return (
                                      <>
                                        <IndexListsWrapper>
                                          <IndexLists
                                            selected={selected}
                                            lists={flow(
                                              map(list => ({
                                                ...list,
                                                progress: getListProgress(
                                                  list.id
                                                )
                                              }))
                                            )(lists)}
                                            onSelect={id => setSelected(id)}
                                            progress={getListProgress("all")}
                                          />
                                        </IndexListsWrapper>
                                        <IndexHabitsListWrapper>
                                          <IndexHabitsList
                                            date={date}
                                            habits={habitsCurrentUnfinishedByList(
                                              selected
                                            )}
                                          />
                                        </IndexHabitsListWrapper>
                                        <br />
                                        <Toggler initialValue={false}>
                                          {({ value, setValue }) => (
                                            <>
                                              <Button
                                                variant={"outlined"}
                                                style={{
                                                  width: "100%"
                                                }}
                                                onClick={() => setValue(!value)}
                                              >
                                                {value
                                                  ? "Hide completed"
                                                  : "Show completed"}
                                              </Button>
                                              {value ? (
                                                <>
                                                  <br />
                                                  <br />
                                                  <IndexHabitsListWrapper>
                                                    <IndexHabitsList
                                                      date={date}
                                                      habits={habitsCurrentFinishedByList(
                                                        selected
                                                      )}
                                                    />
                                                  </IndexHabitsListWrapper>
                                                </>
                                              ) : null}
                                            </>
                                          )}
                                        </Toggler>
                                      </>
                                    );
                                  }}
                                </HabitsProvider>
                              </>
                            )}
                          </RecordsProvider>
                        )}
                      </SelectedOnce>
                    )}
                  </ListsProvider>
                </>
              )}
            </IndexDayPicker>
          ) : (
            <Redirect to={"/auth"} />
          )
        }
      </AuthObserver>
    </>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <IndexAppBarBottom />
  </div>
);
