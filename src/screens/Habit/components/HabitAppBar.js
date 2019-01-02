import { Icon, IconButton, Toolbar } from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import React from "react";
import { Link } from "react-router-dom";

export const HabitAppBar = ({ onDelete }) => (
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
        <IconButton onClick={onDelete}>
          <Icon>delete_outline</Icon>
        </IconButton>
      )}
    </FirebaseContext.Consumer>
  </Toolbar>
);
