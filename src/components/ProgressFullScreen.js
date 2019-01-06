import React from "react";

import { Paper, Grid, CircularProgress } from "@material-ui/core";

export const ProgressFullScreen = () => (
  <>
    <Paper
      style={{
        height: "100vh",
        width: "100%",
        padding: "50%"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div>
          <CircularProgress />
        </div>
      </div>
    </Paper>
  </>
);
