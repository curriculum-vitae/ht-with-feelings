import React from "react";
import { AppBar, Toolbar, Icon, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { FirebaseContext } from "contexts/FirebaseContext";

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
