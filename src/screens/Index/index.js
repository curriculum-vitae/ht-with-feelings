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
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from "@material-ui/core";
import { find, flow, map, reverse, slice, sortBy, times } from "lodash/fp";
import moment from "moment";
import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { compose, withState } from "recompose";

const MAX_WIDTH_FOR_TESTS = 420;

const HABITS = [
  {
    _id: "0",
    name: "Drinking water"
  },
  {
    _id: "1",
    name: "Using Pomodoro Technique"
  },
  {
    _id: "2",
    name: "Writing to Journal"
  },
  {
    _id: "3",
    name: "Procrastinating Less"
  },
  {
    _id: "4",
    name: "Getting up after waking up"
  },
  {
    _id: "5",
    name: "Eating Good"
  },
  {
    _id: "6",
    name: "Do not cross your legs"
  }
];

const FEELINGS = [`😢`, `🙁`, `😐`, `😁`];

const generateFakeStat = () => ({
  dates: [new Date(Date.now() - Math.random() * 10000000000)],
  feelings: [getRandomEmotion()]
});

const generateFakeStats = n =>
  flow(
    times(generateFakeStat),
    sortBy(stat => stat.dates[0]),
    reverse
  )(n);

const getRandomFontSize = () => {
  if (Math.random() > 0.9) return 70;
  if (Math.random() > 0.5) return 60;
  if (Math.random() > 0.4) return 60;
  if (Math.random() > 0.1) return 30;
  return 20;
};

const getRandomEmotion = flow(
  Math.random,
  r => r * FEELINGS.length,
  Math.floor,
  index => FEELINGS[index]
);

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

const Habits = ({ habits, feelings, setFeelings }) => (
  <List>
    {habits.map(habit => (
      <ListItem
        key={habit.name}
        divider={true}
        component={Link}
        to={`/habits/${habit._id}`}
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

const Habit = ({ habit, stats }) => (
  <>
    <div
      style={{
        marginTop: "40px",
        padding: "0px 20px"
      }}
    >
      <Typography variant={"h4"} gutterBottom>
        {habit.name}
      </Typography>
      <Chip label={"2 day streak"} variant={"outlined"} color={"primary"} />
      <br />
      <br />
      <br />
      <Grid container alignItems={"flex-end"}>
        <Grid item xs={6}>
          <Typography variant={"h6"}>Stats</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={"caption"} style={{ textAlign: "right" }}>
            {" "}
            last 21 day
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {flow(
          slice(1, FEELINGS.length),
          map(feeling => (
            <Grid
              item
              xs={4}
              style={{ textAlign: "center" }}
              alignItems={"flex-end"}
            >
              <div
                style={{
                  fontSize: `${getRandomFontSize()}px`,
                  height: "80px"
                }}
              >
                {feeling}
              </div>
              <Typography>{Math.round(Math.random() * 100) / 1}%</Typography>
            </Grid>
          ))
        )(FEELINGS)}
      </Grid>
      <br />

      <Typography variant={"h6"} gutterBottom>
        Calendar
      </Typography>
      <Grid container>
        {flow(
          generateFakeStats,
          map(stat => (
            <Grid item xs={2}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "32px",
                  padding: "2px 0px"
                }}
              >
                {stat.feelings[0]}
              </div>
            </Grid>
          ))
        )(60)}
      </Grid>
      <Typography variant={"h6"} gutterBottom>
        Log
      </Typography>

      <List dense>
        {flow(
          generateFakeStats,
          map(stat => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>{stat.feelings[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={moment(stat.dates[0]).format("DD/MM/YYYY, HH:mm")}
              />
            </ListItem>
          ))
        )(50)}
      </List>
    </div>
  </>
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
                <Habits
                  habits={HABITS.slice(0, 5)}
                  feelings={feelings}
                  setFeelings={setFeelings}
                />
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
                <Habits
                  habits={HABITS.slice(5, HABITS.length - 1)}
                  feelings={feelings}
                  setFeelings={setFeelings}
                />
              </>
            )}
          />
          <Route
            path={"/habits/:_idHabit"}
            render={({ match: { params } }) => (
              <div>
                <Habit
                  habit={flow(find(habit => habit._id === params._idHabit))(
                    HABITS
                  )}
                />
              </div>
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
          left: `${(window.screen.width - MAX_WIDTH_FOR_TESTS) / 2}px`
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
            <Icon />
          </IconButton>
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
          >
            <Icon>add</Icon>
          </Fab>
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
