import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Icon,
  Chip,
  IconButton,
  Toolbar,
  TextField
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import React from "react";
import { Link } from "react-router-dom";
import { Toggler } from "components/Toggler";
import firebase from "firebase/app";
import { flow, map } from "lodash/fp";
import { ListsProvider } from "providers/ListsProvider";
import { SelectedMany } from "components/SelectedMany";

const HabitEdit = ({ habit, open, onClose, onSave }) => (
  <Dialog open={open}>
    <DialogTitle>Edit</DialogTitle>

    <SelectedMany initialSelected={habit.lists.map(l => l.id)}>
      {({ add, remove, selected }) => (
        <>
          <DialogContent>
            <TextField fullWidth value={habit.name} />
            <br />
            <br />
            <ListsProvider>
              {props => (
                <>
                  {flow(
                    props => props.lists,
                    map(list => (
                      <Chip
                        key={list.id}
                        variant={"outlined"}
                        color={
                          selected.includes(list.id) ? "primary" : undefined
                        }
                        style={{
                          margin: "0px 10px 10px 0px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          if (selected.includes(list.id)) {
                            remove(list.id);
                          } else {
                            add(list.id);
                          }
                        }}
                        label={list.name}
                      />
                    ))
                  )(props)}
                </>
              )}
            </ListsProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => {
                const data = {
                  name: habit.name,
                  lists: selected.map(idList => {
                    return firebase.firestore().doc(`lists/${idList}`);
                  })
                };

                onSave(data);
              }}
            >
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </SelectedMany>
  </Dialog>
);

export const HabitAppBar = ({ habit, onDelete }) => (
  <Toolbar>
    <div
      style={{
        flexGrow: "1"
      }}
    >
      <IconButton component={Link} to={"/"}>
        <Icon>arrow_back</Icon>
      </IconButton>
    </div>
    <FirebaseContext.Consumer>
      {db => (
        <IconButton
          onClick={() => {
            if (window.confirm("Are you sure you want to delete?")) {
              onDelete();
            }
          }}
        >
          <Icon>delete_outline</Icon>
        </IconButton>
      )}
    </FirebaseContext.Consumer>

    <Toggler initialValue={true}>
      {({ value, setValue }) => (
        <>
          <IconButton
            onClick={() => {
              setValue(true);
            }}
          >
            <Icon>edit_outline</Icon>
          </IconButton>
          <FirebaseContext.Consumer>
            {db => (
              <>
                <HabitEdit
                  open={value}
                  habit={habit}
                  onClose={() => setValue(false)}
                  onSave={data => {
                    db.collection("habits")
                      .doc(habit.id)
                      .update(data)
                      .then(() => {
                        setValue(false);
                      })
                      .catch(e => console.log(e));
                  }}
                />
              </>
            )}
          </FirebaseContext.Consumer>
        </>
      )}
    </Toggler>
  </Toolbar>
);
