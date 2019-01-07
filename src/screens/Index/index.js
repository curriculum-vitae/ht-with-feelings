import { Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { ProgressFullScreen } from "components/ProgressFullScreen";
import { SelectedOnce } from "components/SelectedOnce";
import { Toggler } from "components/Toggler";
import { AuthObserver } from "features/AuthObserver";
import { filter, find, flow, map } from "lodash/fp";
import moment from "moment";
import { HabitsProvider } from "providers/HabitsProvider";
import { ListsProvider } from "providers/ListsProvider";
import { RecordsProvider } from "providers/RecordsProvider";
import React from "react";
import { Redirect } from "react-router-dom";
import { IndexAppBarBottom } from "screens/Index/components/IndexAppBarBottom";
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
import { IndexButtonToggleFinished } from "screens/Index/components/IndexButtonToggleFinished";
import { IndexDayPicker } from "screens/Index/components/IndexDayPicker";
import { IndexHabitsList } from "screens/Index/components/IndexHabitsList";
import { IndexHabitsListEmpty } from "screens/Index/components/IndexHabitsListEmpty";
import { IndexLists } from "screens/Index/components/IndexLists";
import { formatMomentForCalendarHeader } from "screens/Index/helpers";
import { FEELING_OF_THE_END } from "shared/constants";
import { isHabitIsFromList } from "shared/helpers";

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
      padding: "0px 16px"
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
            <ProgressFullScreen />
          ) : isSignedIn ? (
            <IndexDayPicker initialDate={moment()}>
              {({ date, setDatePrev, setDateNext }) => (
                <>
                  <Toggler initialValue={false}>
                    {props => (
                      <>
                        <IndexAppBarTop
                          onClickDate={() => props.setValue(!props.value)}
                        />
                        <Grid
                          container
                          spacing={0}
                          style={{
                            margin: "16px 0px",
                            display: !!props.value ? undefined : "none"
                          }}
                        >
                          <Grid item xs={12}>
                            <Grid container alignItems={"center"}>
                              <Grid item xs={4}>
                                <IconButton onClick={setDatePrev}>
                                  <Icon>arrow_left</Icon>
                                </IconButton>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant={"h6"} align={"center"}>
                                  {formatMomentForCalendarHeader(date)}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <IconButton
                                  onClick={setDateNext}
                                  style={{ float: "right" }}
                                >
                                  <Icon>arrow_right</Icon>
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Toggler>
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
                                    const countOfFinished = habitsCurrentFinishedByList(
                                      selected
                                    ).length;

                                    const countofUnfinished = habitsCurrentUnfinishedByList(
                                      selected
                                    ).length;

                                    const countOfLists = lists.length;
                                    return (
                                      <>
                                        <IndexListsWrapper>
                                          {countOfLists > 0 ? (
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
                                          ) : null}
                                        </IndexListsWrapper>
                                        <IndexHabitsListWrapper>
                                          {countofUnfinished > 0 ? (
                                            <IndexHabitsList
                                              date={date}
                                              habits={habitsCurrentUnfinishedByList(
                                                selected
                                              )}
                                            />
                                          ) : (
                                            <>
                                              <IndexHabitsListEmpty />
                                              <br />
                                            </>
                                          )}
                                        </IndexHabitsListWrapper>
                                        <Toggler initialValue={false}>
                                          {({ value, setValue }) => (
                                            <>
                                              {countOfFinished > 0 ? (
                                                <IndexHabitsListWrapper>
                                                  <IndexButtonToggleFinished
                                                    onClick={() =>
                                                      setValue(!value)
                                                    }
                                                  >
                                                    {value
                                                      ? `Hide`
                                                      : `Show completed (${countOfFinished})`}
                                                  </IndexButtonToggleFinished>
                                                </IndexHabitsListWrapper>
                                              ) : null}
                                              {value ? (
                                                <>
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
