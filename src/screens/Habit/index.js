import {
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from "@material-ui/core";
import { flow, map, slice } from "lodash/fp";
import moment from "moment";
import React from "react";
import { FEELINGS } from "shared/constants";
import { getRandomFontSize } from "shared/helpers";
import { generateFakeStats } from "screens/Habit/helpers";

export const Habit = ({ habit, stats }) => (
  <>
    <div
      style={{
        marginTop: "40px",
        padding: "0px 20px"
      }}
    >
      <Typography variant={"h4"} gutterBottom>
        {habit.name}
      </Typography>
      <Chip label={"2 day streak"} variant={"outlined"} color={"primary"} />
      <br />
      <br />
      <br />
      <Grid container alignItems={"flex-end"}>
        <Grid item xs={6}>
          <Typography variant={"h6"}>Stats</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={"caption"} style={{ textAlign: "right" }}>
            {" "}
            last 21 day
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {flow(
          slice(1, FEELINGS.length),
          map(feeling => (
            <Grid item xs={4} style={{ textAlign: "center" }} key={feeling}>
              <div
                style={{
                  fontSize: `${getRandomFontSize()}px`,
                  height: "80px"
                }}
              >
                {feeling}
              </div>
              <Typography>{Math.round(Math.random() * 100) / 1}%</Typography>
            </Grid>
          ))
        )(FEELINGS)}
      </Grid>
      <br />

      <Typography variant={"h6"} gutterBottom>
        Calendar
      </Typography>
      <Grid container>
        {flow(
          generateFakeStats,
          map(stat => (
            <Grid item xs={2} key={Math.random()}>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "32px",
                  padding: "2px 0px"
                }}
              >
                {stat.feelings[0]}
              </div>
            </Grid>
          ))
        )(60)}
      </Grid>
      <Typography variant={"h6"} gutterBottom>
        Log
      </Typography>

      <List dense>
        {flow(
          generateFakeStats,
          map(stat => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>{stat.feelings[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={moment(stat.dates[0]).format("DD/MM/YYYY, HH:mm")}
              />
            </ListItem>
          ))
        )(50)}
      </List>
    </div>
  </>
);
