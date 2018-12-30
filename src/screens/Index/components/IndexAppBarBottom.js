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
  Fab,
  Chip
} from "@material-ui/core";
import firebase from "firebase/app";
import { compose, setDisplayName, withState } from "recompose";
import { flow, map } from "lodash/fp";
import { Toggler } from "components/Toggler";
import { ListsProvider } from "providers/ListsProvider";
import { SelectedMany } from "components/SelectedMany";

const HabitAdd = compose(
  setDisplayName("HabitAdd"),
  withState("value", "setValue", "")
)(({ isOpen, value, setValue, onClose }) => (
  <SelectedMany initialSelected={[]}>
    {({ selected, add, remove }) => (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Add new habit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{
              maxWidth: "320px",
              minWidth: "280px"
            }}
          />
          <br />
          <br />
          <ListsProvider>
            {props =>
              flow(
                props => props.lists,
                map(list => (
                  <Chip
                    key={list.id}
                    label={list.name}
                    style={{ marginRight: "5px" }}
                    variant={"outlined"}
                    color={selected.includes(list.id) ? "primary" : undefined}
                    onClick={() => {
                      if (selected.includes(list.id)) {
                        remove(list.id);
                      } else {
                        add(list.id);
                      }
                    }}
                  />
                ))
              )(props)
            }
          </ListsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <FirebaseContext.Consumer>
            {db => (
              <Button
                onClick={() => {
                  db.collection("habits")
                    .add({
                      name: value,
                      lists: selected.map(id =>
                        firebase.firestore().doc(`lists/${id}`)
                      )
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
    )}
  </SelectedMany>
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
    elevation={1}
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
