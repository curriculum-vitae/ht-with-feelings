import React from "react";
import { Avatar, Chip, ButtonBase } from "@material-ui/core";
import { flow, filter } from "lodash/fp";

const IndexFeelingsWithButton = ({ feelings, selected = [], onChange }) => (
  <div
    style={{
      display: "flex",
      marginTop: "8px"
    }}
  >
    {feelings.map(icon => (
      <ButtonBase
        size={"small"}
        variant={"outlined"}
        style={{
          opacity: selected.includes(icon) ? undefined : "0.35",
          marginRight: "15px",
          fontSize: "32px",
          flexGrow: "1",
          flexBasis: "0"
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.includes(icon)) {
            onChange(flow(filter(item => item !== icon))(selected));
          } else {
            onChange([...selected, icon]);
          }
        }}
        key={icon}
      >
        {icon}
      </ButtonBase>
    ))}
  </div>
);

const IndexFeelingsWithChip = ({ feelings, selected = [], onChange }) => (
  <div
    style={{
      display: "flex"
    }}
  >
    {feelings.map(icon => (
      <Chip
        variant={"outlined"}
        style={{
          opacity: selected.includes(icon) ? undefined : "0.35",
          marginLeft: "11px",
          marginRight: "11px",
          flexGrow: "1",
          fontSize: "24px",
          flexBasis: "0"
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.includes(icon)) {
            onChange(flow(filter(item => item !== icon))(selected));
          } else {
            onChange([...selected, icon]);
          }
        }}
        label={icon}
        key={icon}
      />
    ))}
  </div>
);

export const IndexFeelings = IndexFeelingsWithChip;
