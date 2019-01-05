import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import { SelectedMany } from "components/SelectedMany";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { flow, map } from "lodash/fp";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
import { compose, setDisplayName, withState } from "recompose";

export const IndexHabitAdd = compose(
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
