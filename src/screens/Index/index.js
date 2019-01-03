import { Grid, Icon, IconButton, Typography } from "@material-ui/core";
import { SelectedOnce } from "components/SelectedOnce";
import { filter, find, flow } from "lodash/fp";
import moment from "moment";
import { HabitsProvider } from "providers/HabitsProvider";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
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
      minHeight: "100vh",
      borderLeft: "1px solid grey",
      borderRight: "1px solid grey"
    }}
  >
    <>
      <IndexDayPicker initialDate={moment()}>
        {({ date, setDatePrev, setDateNext }) => (
          <>
            <IndexAppBarTop />
            <Grid container>
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
                              padding: "0px 16px"
                            }}
                          >
                            <HabitsProvider>
                              {props => (
                                <IndexHabitsList
                                  date={date}
                                  habits={flow(
                                    props => props.habits,
                                    selected === "all"
                                      ? p => p
                                      : filter(isHabitIsFromList(selected))
                                  )(props)}
                                />
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
    </>
    <br />
    <br />
    <br />
    <br />
    <IndexAppBarBottom />
  </div>
);
