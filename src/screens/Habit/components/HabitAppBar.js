import { Icon, IconButton, Toolbar } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import React from "react";
import { Link } from "react-router-dom";
import { Toggler } from "components/Toggler";

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

    <Toggler initialValue={false}>
      {({ value, setValue }) => (
        <>
          <IconButton onClick={() => window.alert("TODO")}>
            <Icon>edit_outline</Icon>
          </IconButton>
        </>
      )}
    </Toggler>
  </Toolbar>
);
