import React from "react";
import { Avatar, Chip, ButtonBase, Badge } from "@material-ui/core";
import { flow, filter, map, reduce } from "lodash/fp";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  badge: {
    top: 8,
    right: -12,
    // The border color match the background color.
    backgroundColor: theme.palette.grey[100],
    border: `2px solid ${
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
    }`
  }
});

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

const IndexFeelingsWithChip = ({
  feelings,
  selected = [],
  onChange,
  classes
}) => (
  <div
    style={{
      display: "flex"
    }}
  >
    {flow(
      map(icon => (
        <div
          key={icon}
          style={{
            flexGrow: "1",
            flexBasis: "0",
            textAlign: "center"
          }}
        >
          <Badge
            key={icon}
            badgeContent={selected.filter(i => i === icon).length}
            classes={{
              badge: classes.badge
            }}
          >
            <Chip
              variant={"outlined"}
              style={{
                opacity: selected.includes(icon) ? undefined : "0.35",
                fontSize: "28px",
                border: "0px"
              }}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();

                onChange([...selected, icon]);
                if (selected.includes(icon)) {
                  // onChange(flow(filter(item => item !== icon))(selected));
                } else {
                  // onChange([...selected, icon]);
                }
              }}
              label={icon}
            />
          </Badge>
        </div>
      ))
    )(feelings)}
  </div>
);

export const IndexFeelings = withStyles(styles)(IndexFeelingsWithChip);
