import React from "react";

import { Paper, Typography, IconButton, Icon } from "@material-ui/core";

import { grey } from "@material-ui/core/colors";

export const IndexHabitsListEmpty = () => (
  <Paper
    style={{
      padding: "40px"
    }}
    elevation={0}
  >
    <div style={{ textAlign: "center" }}>
      <IconButton disabled>
        <Icon style={{ fontSize: "80px" }}>done_outline</Icon>
      </IconButton>
    </div>
    <Typography variant={"h3"} align={"center"} style={{ color: grey[500] }}>
      Empty
    </Typography>
  </Paper>
);
