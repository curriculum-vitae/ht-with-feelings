import React from "react";
import { Typography, Button } from "@material-ui/core";

export const CalendarWeekDay = ({ date, onClick, isSelected }) => (
  <div
    style={{
      textAlign: "center",
      width: "100%",
      cursor: "pointer"
    }}
    onClick={() => onClick(date)}
  >
    <Button
      color={isSelected ? "primary" : undefined}
      variant={isSelected ? "outlined" : undefined}
    >
      {date.format("DD")}
    </Button>
  </div>
);

export const CalendarWeek = ({ date, onClickDate }) => {
  return (
    <div style={{ display: "flex" }}>
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
    </div>
  );
};
