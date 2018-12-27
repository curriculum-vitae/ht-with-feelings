import {
  AppBar,
  Avatar,
  Button,
  ButtonBase,
  Chip,
  Fab,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  Dialog,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  DialogContent,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  TextField,
  DialogTitle,
  DialogActions
} from "@material-ui/core";
import { find, flow, map, reverse, slice, sortBy, times } from "lodash/fp";
import moment from "moment";
import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import {
  compose,
  withState,
  setDisplayName,
  renderComponent,
  lifecycle
} from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";
import { Habit } from "screens/Habit";
import { FEELINGS } from "shared/constants";

const MAX_WIDTH_FOR_TESTS = 420;

const Toggler = compose(
  withState("value", "setValue", ({ initialValue }) => initialValue),
  setDisplayName("Toggler")
)(({ children, value, setValue }) => children({ value, setValue }));

const Feelings = ({ selected = [], onChange }) => (
  <>
    {FEELINGS.map(icon => (
      <ButtonBase
        size={"small"}
        variant={"outlined"}
        style={{
          opacity: selected.includes(icon) ? "1" : "0.25",
          marginRight: "15px",
          fontSize: "32px"
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.includes(icon)) {
            onChange([]);
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

const HabitsProvider = compose(
  withState("habits", "setHabits", []),
  lifecycle({
    componentDidMount() {
      const { db } = this.props;
      db.collection("habits")
        .get()
        .then(querySnapshot => {
          const result = [];
          querySnapshot.forEach(doc =>
            result.push({
              id: doc.id,
              ...doc.data()
            })
          );
          this.setState({ habits: result });
        })
        .catch(e => console.log(e));
    }
  })
)(({ children, habits }) => (children ? children({ habits }) : null));

const HabitAdd = compose(
  setDisplayName("HabitAdd"),
  withState("value", "setValue", "")
)(({ isOpen, value, setValue, onClose }) => (
  <Dialog open={isOpen} onClose={onClose}>
    <DialogTitle>Add new habit</DialogTitle>
    <DialogContent>
      <form>
        <TextField
          fullWidth
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            maxWidth: "320px",
            minWidth: "280px"
          }}
        />
      </form>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <FirebaseContext.Consumer>
        {db => (
          <Button
            onClick={() => {
              db.collection("habits")
                .add({
                  name: value
                })
                .then(docRef => {
                  setValue("");
                })
                .catch(error => {
                  console.error("Error adding document: ", error);
                });
            }}
          >
            Create
          </Button>
        )}
      </FirebaseContext.Consumer>
    </DialogActions>
  </Dialog>
));

const Habits = ({ habits, feelings, setFeelings }) => (
  <List>
    {habits.map(habit => (
      <ListItem
        key={habit.id}
        divider={true}
        component={Link}
        to={`/habits/${habit.id}`}
      >
        <ListItemText
          primary={<Typography variant={"h6"}>{habit.name}</Typography>}
          secondary={
            <Feelings
              selected={feelings[habit.name]}
              onChange={changes => {
                setFeelings({
                  ...feelings,
                  [habit.name]: changes
                });
              }}
            />
          }
        />
        <ListItemSecondaryAction style={{ opacity: "0.3" }}>
          <IconButton aria-label="Comments">
            <Icon>snooze</Icon>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
);

export const IndexScreen = compose(withState("feelings", "setFeelings", {}))(
  ({ feelings, setFeelings }) => (
    <Paper
      elevation={0}
      square
      style={{
        maxWidth: `${MAX_WIDTH_FOR_TESTS}px`,
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100vh"
      }}
    >
      <Router>
        <>
          <AppBar position={"static"} color={"default"}>
            <Toolbar variant={"dense"}>
              <Link to={"/"}>
                <Typography
                  style={{ padding: "16px 16px 8px 0px" }}
                  variant={"h6"}
                  gutterBottom
                >
                  Habits Tracker
                </Typography>
              </Link>
            </Toolbar>
          </AppBar>
          <Route
            path={"/"}
            exact
            render={() => (
              <>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                  value={"/"}
                  centered
                  scrollButtons={"auto"}
                >
                  <Tab label="Focus" component={Link} to={"/"} value={"/"} />
                  <Tab
                    label="Snoozed"
                    component={Link}
                    to={"/snoozed"}
                    value={"/snoozed"}
                  />
                </Tabs>

                <FirebaseContext.Consumer>
                  {db => (
                    <HabitsProvider db={db}>
                      {props => (
                        <Habits
                          habits={props.habits}
                          feelings={feelings}
                          setFeelings={setFeelings}
                        />
                      )}
                    </HabitsProvider>
                  )}
                </FirebaseContext.Consumer>
              </>
            )}
          />

          <Route
            path={"/snoozed"}
            render={() => (
              <>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                  value={"/snoozed"}
                  centered
                  scrollButtons={"auto"}
                >
                  <Tab label="Focus" component={Link} to={"/"} value={"/"} />
                  <Tab
                    label="Snoozed"
                    component={Link}
                    to={"/snoozed"}
                    value={"/snoozed"}
                  />
                </Tabs>
                <FirebaseContext.Consumer>
                  {db => (
                    <HabitsProvider db={db}>
                      {props => (
                        <Habits
                          habits={props.habits}
                          feelings={feelings}
                          setFeelings={setFeelings}
                        />
                      )}
                    </HabitsProvider>
                  )}
                </FirebaseContext.Consumer>
              </>
            )}
          />
          <Route
            path={"/habits/:idHabit"}
            render={({ match: { params } }) => (
              <FirebaseContext.Consumer>
                {db => (
                  <HabitsProvider db={db}>
                    {props =>
                      props.habits.length > 0 ? (
                        <Habit
                          habit={flow(
                            props => props.habits,
                            find(habit => habit.id === params.idHabit)
                          )(props)}
                        />
                      ) : null
                    }
                  </HabitsProvider>
                )}
              </FirebaseContext.Consumer>
            )}
          />
        </>
      </Router>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <AppBar
        color={"default"}
        position={"fixed"}
        style={{
          top: "auto",
          bottom: "0",
          width: `${MAX_WIDTH_FOR_TESTS}px`,
          maxWidth: "100%",
          left: `${(window.innerWidth - MAX_WIDTH_FOR_TESTS) / 2}px`
        }}
        elevation={2}
      >
        <Toolbar
          style={{
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <IconButton color="inherit" aria-label="Open drawer">
            <Icon>filter</Icon>
          </IconButton>

          <Toggler initialValue={false}>
            {({ value, setValue }) => (
              <>
                <HabitAdd isOpen={value} onClose={() => setValue(false)} />
                <Fab
                  color={"secondary"}
                  aria-label={"Add"}
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    top: -30,
                    left: 0,
                    right: 0,
                    margin: "0 auto"
                  }}
                  onClick={() => {
                    setValue(true);
                  }}
                >
                  <Icon>add</Icon>
                </Fab>
              </>
            )}
          </Toggler>

          <div>
            {Object.keys(feelings).length === 0 &&
            feelings.constructor === Object ? (
              <>
                <IconButton color="inherit">
                  <Icon>search</Icon>
                </IconButton>
                <IconButton color="inherit">
                  <Icon>more</Icon>
                </IconButton>
              </>
            ) : (
              <Button
                onClick={() => {
                  setFeelings({});
                  window.alert("Success!");
                }}
              >
                Submit
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Paper>
  )
);
