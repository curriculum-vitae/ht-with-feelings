import React from "react";
import { Typography, IconButton, Button, Icon } from "@material-ui/core";

export const CalendarWeekDay = ({ date, onClick, isSelected }) => (
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
        fontSize: "12px"
      }}
      color={isSelected ? "primary" : undefined}
      variant={isSelected ? "outlined" : undefined}
    >
      {date.format("DD")}
    </IconButton>
  </div>
);

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
