import React from "react";
import { AppBar, Typography, Toolbar } from "@material-ui/core";

import { Link } from "react-router-dom";

export const IndexAppBarTop = () => (
  <AppBar position={"static"} color={"default"}>
    <Toolbar variant={"dense"}>
      <Link to={"/"}>
        <Typography
          style={{ padding: "16px 16px 8px 0px" }}
          variant={"h6"}
          gutterBottom
        >
          Habits Tracker
        </Typography>
      </Link>
    </Toolbar>
  </AppBar>
);
