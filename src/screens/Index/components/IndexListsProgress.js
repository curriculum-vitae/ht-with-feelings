import { grey } from "@material-ui/core/colors";
import React from "react";

export const IndexListsProgress = ({ percentage, height = 4 }) => {
  const isDone = percentage === 100;
  const isNothing = percentage === 0;
  const palette = isDone ? grey : grey;
  return (
    <>
      <div
        style={{
          display: "inline-block",
          height: `${height}px`,
          borderRadius: isDone ? "2px" : "2px 0px 0px 2px",
          backgroundColor: `${palette[800]}`,
          width: `${percentage}%`
        }}
      />
      <div
        style={{
          display: isDone ? "none" : "inline-block",
          height: `${height}px`,
          borderRadius: isNothing ? "2px" : "0px 2px 2px 0px",
          backgroundColor: `${palette[400]}`,
          width: `${100 - percentage}%`
        }}
      />
    </>
  );
};
