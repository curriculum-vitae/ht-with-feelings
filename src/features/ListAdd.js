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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export const ListAdd = compose(
  setDisplayName("HabitAddListAdd"),
  withState("value", "setValue", "")
)(({ isOpen, onClose, value, setValue }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    fullWidth
    maxWidth={"sm"}
    fullScreen
    TransitionComponent={Transition}
  >
    <DialogTitle>Add new list</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{}}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <FirebaseContext.Consumer>
        {db => (
          <Button
            color={"primary"}
            variant={"contained"}
            onClick={() => {
              const { uid } = firebase.auth().currentUser;
              const data = {
                name: value,
                uid
              };

              db.collection("lists")
                .add(data)
                .then(docRef => {
                  setValue("");
                })
                .catch(error => {
                  console.error("Error adding document: ", error);
                });
              onClose();
            }}
          >
            Create
          </Button>
        )}
      </FirebaseContext.Consumer>
    </DialogActions>
  </Dialog>
));
