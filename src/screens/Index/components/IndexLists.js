import { Typography } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import { flow, map } from "lodash/fp";
import React from "react";

const Progress = ({ percentage, height = 4 }) => {
  const isDone = percentage > 80;
  const palette = isDone ? green : grey;
  return (
    <>
      <div
        style={{
          display: "inline-block",
          height: `${height}px`,
          borderRadius: "2px",
          backgroundColor: `${palette[500]}`,
          width: `${percentage}%`
        }}
      />
      <div
        style={{
          display: isDone ? "none" : "inline-block",
          height: `${height}px`,
          borderRadius: "2px",
          backgroundColor: `${palette[300]}`,
          width: `${100 - percentage}%`
        }}
      />
    </>
  );
};

export const IndexLists = ({ lists, selected, onSelect }) => (
  <>
    {flow(
      map(list => (
        <div
          key={list.id}
          style={{
            display: "inline-block",
            marginRight: "20px"
          }}
        >
          <Typography
            style={{
              cursor: "pointer",
              fontWeight: list.id === selected ? "bold" : undefined
            }}
            variant={"subtitle1"}
            onClick={() => onSelect(list.id)}
          >
            #{list.name}
          </Typography>

          <div
            style={{
              marginTop: "-6px"
            }}
          >
            <Progress percentage={Math.random() * 100} />
          </div>
        </div>
      ))
    )(lists)}
  </>
);
