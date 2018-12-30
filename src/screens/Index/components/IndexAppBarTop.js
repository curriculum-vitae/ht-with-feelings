import React from "react";
import { Typography, Toolbar } from "@material-ui/core";

import { Link } from "react-router-dom";

export const IndexAppBarTop = () => (
  <Toolbar>
    <Link to={"/"}>
      <Typography style={{ padding: "32px 32px 16px 8px" }} variant={"h4"}>
        My habits
      </Typography>
    </Link>
  </Toolbar>
);
