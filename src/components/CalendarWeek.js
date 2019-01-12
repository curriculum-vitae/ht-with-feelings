import { Button, Icon, IconButton } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";
import { compose } from "lodash/fp";
import moment from "moment";
import React from "react";
import { setDisplayName } from "recompose";

export const CalendarWeekDay = compose(
  setDisplayName("CalendarWeekDay"),
  withTheme()
)(({ date, onClick, isSelected, isToday, theme }) => (
  <div
    style={{
      textAlign: "center",
      width: "100%",
      cursor: "pointer"
    }}
    size={"small"}
    onClick={() => onClick(date)}
  >
    <IconButton
      style={{
        fontSize: "12px",
        backgroundColor: isSelected
          ? theme.palette.primary.light
          : isToday
          ? theme.palette.grey[300]
          : undefined
      }}
    >
      {isToday ? "T" : date.format("DD")}
    </IconButton>
  </div>
));

export const CalendarWeek = ({
  date,
  onClickDate,
  onClickArrowLeft,
  onClickArrowRight,
  showArrows
}) => {
  return (
    <div style={{ display: "flex" }}>
      <Button size={"small"} onClick={onClickArrowLeft}>
        <Icon>arrow_left</Icon>
      </Button>

      {[...new Array(7)].map((value, index) => {
        const dateOfWeek = date
          .clone()
          .startOf("week")
          .add(index, "day");

        return (
          <CalendarWeekDay
            key={dateOfWeek.format("MMDDYY")}
            isSelected={dateOfWeek.format("MMDDYY") === date.format("MMDDYY")}
            isToday={moment().format("MMDDYY") === dateOfWeek.format("MMDDYY")}
            date={dateOfWeek}
            onClick={onClickDate}
          />
        );
      })}
      <Button size={"small"} onClick={onClickArrowRight}>
        <Icon>arrow_right</Icon>
      </Button>
    </div>
  );
};
