import { CalendarDay } from "components/CalendarDay";
import { CalendarWeek } from "components/CalendarWeek";
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
import { isHabitIsFromList } from "shared/helpers";
import { FEELING_OF_THE_END } from "shared/constants";
import Scrollbar from "react-scrollbars-custom";

const IndexListsWrapper = ({ children }) => (
  <Scrollbar
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

const IndexContentWrapper = ({ children }) => (
  <div
    style={{
      padding: "0px 16px"
    }}
    children={children}
  />
);

const IndexCalendarPickerWrapper = ({ children }) => (
  <div
    style={{
      padding: "8px 0px"
    }}
    children={children}
  />
);

const IndexWrapper = ({ children }) => (
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      paddingBottom: "60px"
    }}
    children={children}
  />
);

export const IndexScreen = ({ hideCompleted = true }) => (
  <IndexWrapper>
    <AuthObserver>
      {({ isSignedIn, loading }) =>
        loading ? (
          <ProgressFullScreen />
        ) : isSignedIn ? (
          <IndexDayPicker initialDate={moment()}>
            {({ date, setDatePrev, setDate, setDateNext }) => (
              <>
                <Toggler initialValue={false}>
                  {props => (
                    <>
                      <IndexAppBarTop
                        onClickDate={() => props.setValue(!props.value)}
                      />
                      <IndexContentWrapper>
                        <IndexCalendarPickerWrapper>
                          {props.value && false ? (
                            <CalendarWeek
                              date={date}
                              onClickDate={setDate}
                              onClickArrowLeft={() =>
                                setDate(date.clone().add(-7, "days"))
                              }
                              onClickArrowRight={() =>
                                setDate(date.clone().add(7, "days"))
                              }
                            />
                          ) : null}
                          {props.value ? (
                            <CalendarDay
                              date={date}
                              onClickArrowLeft={setDatePrev}
                              onClickArrowRight={setDateNext}
                            />
                          ) : null}
                        </IndexCalendarPickerWrapper>
                      </IndexContentWrapper>
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
                                    !!record.feelings.includes(
                                      FEELING_OF_THE_END
                                    )
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
                                    <IndexContentWrapper>
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
                                    </IndexContentWrapper>
                                    {hideCompleted ? (
                                      <Toggler initialValue={false}>
                                        {({ value, setValue }) => (
                                          <>
                                            <br />
                                            {countOfFinishedBySelected > 0 ? (
                                              <IndexContentWrapper>
                                                <IndexButtonToggleFinished
                                                  onClick={() =>
                                                    setValue(!value)
                                                  }
                                                >
                                                  {value
                                                    ? `Hide`
                                                    : `Show completed (${countOfFinishedBySelected})`}
                                                </IndexButtonToggleFinished>
                                              </IndexContentWrapper>
                                            ) : null}
                                            {value ? (
                                              <>
                                                <br />
                                                <IndexContentWrapper>
                                                  <IndexHabitsList
                                                    date={date}
                                                    habits={getHabitsCurrentFinishedByList(
                                                      selected
                                                    )}
                                                    records={records}
                                                  />
                                                </IndexContentWrapper>
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
