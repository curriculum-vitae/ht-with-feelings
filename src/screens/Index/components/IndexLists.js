import React from "react";
import {
  Chip,
  ButtonBase,
  Button,
  Avatar,
  Icon,
  Typography
} from "@material-ui/core";
import { flow, map, sortBy } from "lodash/fp";
import { grey } from "@material-ui/core/colors";

const Progress = ({ percentage }) => (
  <div>
    <div
      style={{
        display: "inline-block",
        height: "5px",
        borderRadius: "2px",
        backgroundColor: `${grey[600]}`,
        width: `${percentage}%`
      }}
    />
    <div
      style={{
        display: "inline-block",
        height: "5px",
        borderRadius: "2px",
        backgroundColor: `${grey[400]}`,
        width: `${100 - percentage}%`
      }}
    />
  </div>
);

export const IndexLists = ({ lists, selected, onSelect }) => (
  <>
    {flow(
      map(list => (
        <div
          key={list.id}
          style={{
            display: "inline-block",
            marginRight: "14px"
          }}
        >
          <Typography
            style={{
              cursor: "pointer"
            }}
            variant={"subtitle1"}
            color={list.id === selected ? "primary" : undefined}
            onClick={() => onSelect(list.id)}
          >
            #{list.name}
          </Typography>
          <Progress percentage={Math.random() * 100} />
        </div>
      ))
    )(lists)}
  </>
);
