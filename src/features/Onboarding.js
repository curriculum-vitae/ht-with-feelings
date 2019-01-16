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
      First Habit Tracker
      <span style={{ color: COLOR_OF_FEELINGS }}> with Feelings</span>
    </Typography>
    <br />
    <br />
    <Typography variant={"h2"} align={"center"}>
      😱
    </Typography>
    <br />
    <br />
    <Typography variant={"h5"} align={"center"}>
      Allowing you{" "}
      <span style={{ color: COLOR_OF_FEELINGS }}>being a human.</span>
    </Typography>
    <br />
    <br />
    <Typography variant={"h2"} align={"center"}>
      😕
    </Typography>
    <br />
    <br />
    <Typography variant={"h5"} align={"center"}>
      Tracking your habits{" "}
      <span style={{ color: COLOR_OF_FEELINGS }}>with emojis</span>
    </Typography>
    <br />
    <br />
    <div style={{ display: "flex" }}>
      {FEELINGS.map(emoji => (
        <div
          key={emoji}
          style={{ flex: "1 1 0", textAlign: "center", fontSize: "32px" }}
        >
          {emoji}
        </div>
      ))}
    </div>
    <br />
    <br />
    <Link to={"/auth"}>
      <Button variant={"outlined"} size={"large"} style={{ width: "100%" }}>
        Let's check it!
      </Button>
    </Link>
  </Paper>
);
