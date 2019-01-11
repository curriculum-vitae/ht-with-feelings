import React from "react";

import { Grid, Typography, Icon, IconButton } from "@material-ui/core";

const formatMomentForCalendarHeader = mDate => {
  var fromNow = mDate.fromNow();
  return mDate.calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: "[Last] dddd",
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd",
    // when the date is further away, use from-now functionality
    sameElse: function() {
      return "[" + fromNow + "]";
    }
  });
};
export const CalendarDay = ({ date, onClickArrowLeft, onClickArrowRight }) => (
  <Grid container spacing={0}>
    <Grid item xs={12}>
      <Grid container alignItems={"center"}>
        <Grid item xs={4}>
          <IconButton onClick={onClickArrowLeft}>
            <Icon>arrow_left</Icon>
          </IconButton>
        </Grid>
        <Grid item xs={4}>
          <Typography variant={"h6"} align={"center"}>
            {formatMomentForCalendarHeader(date)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <IconButton onClick={onClickArrowRight} style={{ float: "right" }}>
            <Icon>arrow_right</Icon>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);
