import React from "react";
import { AppBar, Toolbar, Icon, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";

export const HabitAppBar = () => (
  <AppBar position={"static"}>
    <Toolbar>
      <IconButton component={Link} to={"/"}>
        <Icon>arrow_back</Icon>
      </IconButton>
    </Toolbar>
  </AppBar>
);
