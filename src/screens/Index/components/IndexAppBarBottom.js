import React from "react";
import { FirebaseContext } from "contexts/FirebaseContext";
import {
  AppBar,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Toolbar,
  IconButton,
  Icon,
  Fab
} from "@material-ui/core";

import { compose, setDisplayName, withState } from "recompose";

import { Toggler } from "components/Toggler";

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
                  onClose();
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

export const IndexAppBarBottom = () => (
  <AppBar
    color={"default"}
    position={"static"}
    style={{
      top: "auto",
      position: "absolute",
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
        <Icon>filter_list</Icon>
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
    </Toolbar>
  </AppBar>
);
