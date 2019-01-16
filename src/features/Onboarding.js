import React from "react";

import { Paper, Typography, Button } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { FEELINGS } from "shared/constants";
import { Link } from "react-router-dom";

const COLOR_OF_FEELINGS = red[600];

export const OnboardingScreen = () => (
  <Paper
    square
    style={{ padding: "60px 60px", minHeight: "100vh" }}
    elevation={0}
  >
    <Typography variant={"h4"} align={"center"}>
      First Habit Tracker with{" "}
      <span style={{ color: COLOR_OF_FEELINGS }}>Feelings</span>
    </Typography>
    <br />
    <br />
    <Typography variant={"h2"} align={"center"}>
      😱
    </Typography>
    <br />
    <br />
    <Typography variant={"h5"} align={"center"}>
      Allow yourself{" "}
      <span style={{ color: COLOR_OF_FEELINGS }}>being a human.</span>
    </Typography>
    <br />
    <Typography variant={"h2"} align={"center"}>
      😕
    </Typography>
    <br />
    <Typography variant={"h5"} align={"center"}>
      Track your habits{" "}
      <span style={{ color: COLOR_OF_FEELINGS }}>with emojis</span>
    </Typography>
    <br />
    <div style={{ display: "flex" }}>
      {FEELINGS.map(emoji => (
        <div
          key={emoji}
          style={{ flex: "1 1 0", textAlign: "center", fontSize: "25px" }}
        >
          {emoji}
        </div>
      ))}
    </div>
    <br />
    <Link to={"/"}>
      <Button variant={"outlined"} size={"large"} style={{ width: "100%" }}>
        Start
      </Button>
    </Link>
  </Paper>
);
