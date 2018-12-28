import {
  AppBar,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { flow, map, flatten, uniq, filter, last } from "lodash/fp";
import { FeelingsProvider } from "providers/FeelingsProvider";
import { HabitsProvider } from "providers/HabitsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { compose, setDisplayName, withState } from "recompose";
import { IndexAppBarTop } from "screens/Index/components/IndexAppBarTop";
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
          borderRadius: "100%",
          opacity: selected.includes(icon) ? "1" : "0.3",
          marginRight: "15px",
          fontSize: "24px"
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.includes(icon)) {
            onChange(flow(filter(item => item !== icon))(selected));
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

const Habits = ({ habits, setFeelings }) => (
  <List>
    {habits.map(habit => (
      <ListItem
        key={habit.id}
        divider={true}
        component={Link}
        to={`/habits/${habit.id}`}
      >
        <FirebaseContext.Consumer>
          {db => (
            <FeelingsProvider idHabit={habit.id}>
              {props => {
                const feelingsRecord = flow(
                  props => props.feelings,
                  last
                )(props);

                return (
                  <>
                    <ListItemText
                      primary={
                        <Typography
                          style={{
                            opacity: !!feelingsRecord ? "0.33" : "1.0",
                            textDecoration: !!feelingsRecord
                              ? "line-through"
                              : undefined
                          }}
                          variant={"h6"}
                        >
                          {habit.name}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Feelings
                        selected={feelingsRecord ? feelingsRecord.feelings : []}
                        onChange={feelingsNew => {
                          const dbFeelingsRef = db
                            .collection("habits")
                            .doc(habit.id)
                            .collection("feelings");
                          if (feelingsRecord) {
                            dbFeelingsRef.doc(feelingsRecord.id).set({
                              date: new Date(),
                              feelings: feelingsNew
                            });
                          } else {
                            dbFeelingsRef.add({
                              date: new Date(),
                              feelings: feelingsNew
                            });
                          }
                        }}
                      />
                    </ListItemSecondaryAction>
                  </>
                );
              }}
            </FeelingsProvider>
          )}
        </FirebaseContext.Consumer>
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
        position: "relative",
        minHeight: "100vh"
      }}
    >
      <>
        <IndexAppBarTop />

        <HabitsProvider>
          {props => (
            <Habits
              habits={props.habits}
              feelings={feelings}
              setFeelings={setFeelings}
            />
          )}
        </HabitsProvider>
      </>

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
