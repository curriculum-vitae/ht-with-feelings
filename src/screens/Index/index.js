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
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
import { IndexButtonToggleFinished } from "screens/Index/components/IndexButtonToggleFinished";
import { IndexDayPicker } from "screens/Index/components/IndexDayPicker";
import { IndexHabitsList } from "screens/Index/components/IndexHabitsList";
import { IndexHabitsListEmpty } from "screens/Index/components/IndexHabitsListEmpty";
import { IndexLists } from "screens/Index/components/IndexLists";
import { formatMomentForCalendarHeader } from "screens/Index/helpers";
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

const IndexWrapper = ({ children }) => (
  <div
    style={{
      position: "relative",
      minHeight: "100vh"
    }}
    children={children}
  />
);

export const IndexScreen = ({ hideCompleted = false }) => (
  <IndexWrapper>
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
                            <HabitsProvider>
                              {props => {
                                const filterHabitsByList = idList => habits => {
                                  return idList === "all"
                                    ? habits
                                    : filter(isHabitIsFromList(idList))(habits);
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
                                  const record = findActualHabitRecord(date)(
                                    idHabit
                                  )(records);

                                  return (
                                    !!record &&
                                    !!record.feelings &&
                                    !!record.feelings.length > 0
                                  );
                                };

                                const getHabitsCurrentAllByList = idList =>
                                  flow(
                                    props => props.habits,
                                    filterHabitsByList(idList)
                                  )(props);

                                const getHabitsCurrentUnfinishedByList = idList =>
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

                                const getHabitsCurrentFinishedByList = idList =>
                                  flow(
                                    props => props.habits,
                                    filterHabitsByList(idList),
                                    filter(habit =>
                                      isHabitIsDoneForThisDate(date)(habit.id)(
                                        records
                                      )
                                    )
                                  )(props);

                                const getListProgress = idList => {
                                  return (
                                    (100 *
                                      getHabitsCurrentFinishedByList(idList)
                                        .length) /
                                    (getHabitsCurrentUnfinishedByList(idList)
                                      .length +
                                      getHabitsCurrentFinishedByList(idList)
                                        .length)
                                  );
                                };
                                const countOfAllBySelected = getHabitsCurrentAllByList(
                                  selected
                                ).length;

                                const countOfFinishedBySelected = getHabitsCurrentFinishedByList(
                                  selected
                                ).length;

                                const countofUnfinishedBySelected = getHabitsCurrentUnfinishedByList(
                                  selected
                                ).length;

                                const countOfLists = lists.length;

                                return (
                                  <>
                                    {countOfLists > 0 ? (
                                      <IndexListsWrapper>
                                        <IndexLists
                                          selected={selected}
                                          lists={flow(
                                            map(list => ({
                                              ...list,
                                              progress: getListProgress(list.id)
                                            }))
                                          )(lists)}
                                          onSelect={id => setSelected(id)}
                                          progress={getListProgress("all")}
                                        />
                                      </IndexListsWrapper>
                                    ) : null}
                                    <IndexHabitsListWrapper>
                                      <IndexHabitsList
                                        date={date}
                                        habits={
                                          hideCompleted
                                            ? getHabitsCurrentUnfinishedByList(
                                                selected
                                              )
                                            : getHabitsCurrentAllByList(
                                                selected
                                              )
                                        }
                                        records={records}
                                      />

                                      {(countofUnfinishedBySelected === 0 &&
                                        hideCompleted) ||
                                      countOfAllBySelected === 0 ? (
                                        <IndexHabitsListEmpty />
                                      ) : null}
                                    </IndexHabitsListWrapper>
                                    {hideCompleted ? (
                                      <Toggler initialValue={false}>
                                        {({ value, setValue }) => (
                                          <>
                                            <br />
                                            {countOfFinishedBySelected > 0 ? (
                                              <IndexHabitsListWrapper>
                                                <IndexButtonToggleFinished
                                                  onClick={() =>
                                                    setValue(!value)
                                                  }
                                                >
                                                  {value
                                                    ? `Hide`
                                                    : `Show completed (${countOfFinishedBySelected})`}
                                                </IndexButtonToggleFinished>
                                              </IndexHabitsListWrapper>
                                            ) : null}
                                            {value ? (
                                              <>
                                                <br />
                                                <IndexHabitsListWrapper>
                                                  <IndexHabitsList
                                                    date={date}
                                                    habits={getHabitsCurrentFinishedByList(
                                                      selected
                                                    )}
                                                    records={records}
                                                  />
                                                </IndexHabitsListWrapper>
                                              </>
                                            ) : null}
                                          </>
                                        )}
                                      </Toggler>
                                    ) : null}
                                  </>
                                );
                              }}
                            </HabitsProvider>
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
  </IndexWrapper>
);
