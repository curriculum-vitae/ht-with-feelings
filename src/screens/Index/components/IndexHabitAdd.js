import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Icon,
  Slide,
  Typography,
  Hidden
} from "@material-ui/core";
import { SelectedMany } from "components/SelectedMany";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";
import { flow, map, filter } from "lodash/fp";
import { ListsProvider } from "providers/ListsProvider";
import React from "react";
import { compose, setDisplayName, withState } from "recompose";
import { Toggler } from "components/Toggler";
import { ListAdd } from "features/ListAdd";
import { UsersProvider } from "providers/UsersProvider";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function ListsWrapper(props) {
  return <div {...props} />;
}

function UsersProviderWrapper(props) {
  return false && <div style={{ display: "none" }} {...props} />;
}

export const IndexHabitAdd = compose(
  setDisplayName("HabitAdd"),
  withState("value", "setValue", "")
)(({ isOpen, value, setValue, onClose }) => (
  <SelectedMany initialSelected={[]}>
    {propsSelectedUsers => (
      <SelectedMany initialSelected={[]}>
        {({ selected: listsSelected, add: listsAdd, remove: listsRemove }) => (
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
                <ListsWrapper>
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
                            color={
                              listsSelected.includes(list.id)
                                ? "primary"
                                : undefined
                            }
                            onClick={() => {
                              if (listsSelected.includes(list.id)) {
                                listsRemove(list.id);
                              } else {
                                listsAdd(list.id);
                              }
                            }}
                          />
                        ))
                      )(props)
                    }
                  </ListsProvider>

                  <Toggler initialValue={false}>
                    {({ value, setValue }) => (
                      <Hidden xsUp>
                        <Chip
                          variant={"outlined"}
                          icon={<Icon>add</Icon>}
                          label={"add new list"}
                          onClick={() => setValue(true)}
                          style={{ margin: "0px 5px 5px 0px" }}
                        />
                        <ListAdd
                          isOpen={value}
                          onClose={() => setValue(false)}
                        />
                      </Hidden>
                    )}
                  </Toggler>
                </ListsWrapper>
                <UsersProviderWrapper>
                  <UsersProvider>
                    {propsUsers => {
                      const uid = firebase.auth().currentUser.uid;
                      const usersToRender = flow(
                        props => props.users,
                        filter(user => user.id !== uid)
                      )(propsUsers);

                      return (
                        <>
                          <br />
                          <br />
                          <Typography variant={"h5"}>
                            Share with users
                          </Typography>
                          <ul>
                            {usersToRender.map(user => (
                              <li
                                key={user.id}
                                style={{
                                  fontWeight: propsSelectedUsers.selected.includes(
                                    user.id
                                  )
                                    ? "bold"
                                    : undefined
                                }}
                                onClick={() =>
                                  propsSelectedUsers.toggle(user.id)
                                }
                              >
                                {user.name}
                              </li>
                            ))}
                          </ul>
                        </>
                      );
                    }}
                  </UsersProvider>
                </UsersProviderWrapper>
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
                          uids: [
                            firebase.auth().currentUser.uid,
                            ...propsSelectedUsers.selected
                          ],
                          lists: listsSelected.map(id =>
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
    )}
  </SelectedMany>
));
