import React from "react";

import { Paper, Typography } from "@material-ui/core";

export const IndexHabitsListEmpty = () => (
  <Paper
    style={{
      padding: "40px"
    }}
    elevation={0}
  >
    <Typography variant={"h5"} align={"center"}>
      Nothing on the list
    </Typography>
  </Paper>
);
