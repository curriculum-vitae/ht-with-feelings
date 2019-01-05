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
import { filter, flow } from "lodash/fp";
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
                      <>
                        {lists.length > 0 ? (
                          <SelectedOnce initialSelected={"all"}>
                            {({ selected, setSelected }) => (
                              <>
                                <div
                                  style={{
                                    width: "100%",
                                    maxWidth: "100%",
                                    overflow: "auto",
                                    whiteSpace: "nowrap",
                                    scrollX: "auto",
                                    padding: "0px 16px",
                                    height: "50px"
                                  }}
                                >
                                  <IndexLists
                                    selected={selected}
                                    lists={lists}
                                    onSelect={id => setSelected(id)}
                                  />
                                </div>
                                <div
                                  style={{
                                    padding: "0px 20px"
                                  }}
                                >
                                  <HabitsProvider>
                                    {props => (
                                      <>
                                        <IndexHabitsList
                                          date={date}
                                          displayDone={false}
                                          habits={flow(
                                            props => props.habits,
                                            selected === "all"
                                              ? p => p
                                              : filter(
                                                  isHabitIsFromList(selected)
                                                )
                                          )(props)}
                                        />
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
                                                  <IndexHabitsList
                                                    date={date}
                                                    displayDone={true}
                                                    habits={flow(
                                                      props => props.habits,
                                                      selected === "all"
                                                        ? p => p
                                                        : filter(
                                                            isHabitIsFromList(
                                                              selected
                                                            )
                                                          )
                                                    )(props)}
                                                  />
                                                </>
                                              ) : null}
                                            </>
                                          )}
                                        </Toggler>
                                      </>
                                    )}
                                  </HabitsProvider>
                                </div>
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
