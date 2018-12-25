import React from "react";

import {
  AppBar,
  Toolbar,
  Paper,
  Typography,
  IconButton,
  Fab,
  Tabs,
  Tab,
  Icon,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  Button
} from "@material-ui/core";
import { compose, withState } from "recompose";

const HABITS = [
  {
    name: "Drinking water"
  },
  {
    name: "Using Pomodoro Technique"
  },
  {
    name: "Writing to Journal"
  },
  {
    name: "Procrastinating Less"
  },
  {
    name: "Getting up after waking up"
  },
  {
    name: "Eating Good"
  },
  {
    name: "Do not cross your legs"
  }
];

const FEELINGS = [`😢`, `🙁`, `😐`, `😁`];

const Feelings = ({ selected = [], onChange }) => (
  <>
    {FEELINGS.map(icon => (
      <Button
        size={"small"}
        variant={"outlined"}
        style={{
          opacity: selected.includes(icon) ? "1" : "0.35",
          marginRight: "2px"
        }}
        onClick={() => {
          onChange([...selected, icon]);
        }}
        key={icon}
      >
        {icon}
      </Button>
    ))}
  </>
);

export const IndexScreen = compose(withState("feelings", "setFeelings", {}))(
  ({ feelings, setFeelings }) => (
    <Paper
      elevation={1}
      style={{
        maxWidth: "420px",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        minHeight: "100vh"
      }}
    >
      <AppBar position="static" color="default">
        <Toolbar variant={"dense"}>
          <IconButton
            className={{
              marginLeft: "-18px",
              marginRight: "10px"
            }}
            color="inherit"
            aria-label="Menu"
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography
            style={{ padding: "16px 16px 8px 16px" }}
            variant={"h6"}
            gutterBottom
          >
            Habits Inbox
          </Typography>
        </Toolbar>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          fullWidth
          value={0}
          centered
          scrollButtons={"auto"}
        >
          <Tab label="Focus" />
          <Tab label="Snoozed" />
        </Tabs>
      </AppBar>
      <ListSubheader style={{ backgroundColor: "#171717" }}>All</ListSubheader>
      <List>
        {HABITS.map(habit => (
          <ListItem key={habit.name} divider={false}>
            <ListItemText
              primary={habit.name}
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
          </ListItem>
        ))}
      </List>

      <AppBar
        color={"default"}
        position={"fixed"}
        style={{
          top: "auto",
          bottom: "0"
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
