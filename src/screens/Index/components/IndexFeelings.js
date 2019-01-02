import React from "react";
import { Avatar, Chip, ButtonBase, Badge, Icon } from "@material-ui/core";
import { flow, filter, map, reduce } from "lodash/fp";
import { withStyles } from "@material-ui/core/styles";
import { FEELING_OF_THE_END } from "shared/constants";

const styles = theme => ({
  badge: {
    top: 10,
    right: 0,
    // The border color match the background color.
    backgroundColor: theme.palette.grey[200],
    border: `3px solid ${
      theme.palette.type === "light" ? "white" : theme.palette.grey[900]
    }`
  }
});

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
            invisible={selected.filter(i => i === icon).length <= 1}
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
              }}
              label={icon}
            />
          </Badge>
        </div>
      ))
    )(feelings)}

    <div
      style={{
        display: "none",
        flexGrow: "1",
        flexBasis: "0",
        textAlign: "center"
      }}
    >
      <Chip
        variant={"outlined"}
        style={{
          opacity: selected.length > 0 ? "1" : "0",
          fontSize: "28px",
          border: "0px"
        }}
        icon={<Icon>send</Icon>}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();

          onChange([...selected, FEELING_OF_THE_END]);
        }}
      />
    </div>
  </div>
);

export const IndexFeelings = withStyles(styles)(IndexFeelingsWithChip);
