import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Icon,
  Slide
} from "@material-ui/core";
import { SelectedMany } from "components/SelectedMany";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { flow, map } from "lodash/fp";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
import { compose, setDisplayName, withState } from "recompose";
import { Toggler } from "components/Toggler";
import { ListAdd } from "features/ListAdd";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export const IndexHabitAdd = compose(
  setDisplayName("HabitAdd"),
  withState("value", "setValue", "")
)(({ isOpen, value, setValue, onClose }) => (
  <SelectedMany initialSelected={[]}>
    {({ selected, add, remove }) => (
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth={"sm"}
        fullScreen
        TransitionComponent={Transition}
      >
        <DialogTitle>Add new habit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            style={{}}
          />
          <br />
          <br />
          <div>
            <ListsProvider>
              {props =>
                flow(
                  props => props.lists,
                  map(list => (
                    <Chip
                      key={list.id}
                      label={list.name}
                      style={{ margin: "0px 5px 5px 0px" }}
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
            <Toggler initialValue={false}>
              {({ value, setValue }) => (
                <>
                  <Chip
                    variant={"outlined"}
                    icon={<Icon>add</Icon>}
                    label={"add new list"}
                    onClick={() => setValue(true)}
                  />
                  <ListAdd isOpen={value} onClose={() => setValue(false)} />
                </>
              )}
            </Toggler>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <FirebaseContext.Consumer>
            {db => (
              <Button
                color={"primary"}
                variant={"contained"}
                onClick={() => {
                  db.collection("habits")
                    .add({
                      name: value,
                      uid: firebase.auth().currentUser.uid,
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
