import { Badge, Chip, Icon, Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { flow, map } from "lodash/fp";
import React from "react";
import { FEELING_OF_THE_END } from "shared/constants";

const EMOJI_SIZE = 20;

const styles = theme => ({
  badge: {
    top: 14,
    right: -8,
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
      display: "flex",
      width: "100%"
    }}
  >
    {flow(
      map(icon => (
        <div
          key={icon}
          style={{
            flexGrow: 1,
            flexBasis: 0,
            textAlign: "center"
          }}
        >
          <Badge
            style={{
              width: "100%"
            }}
            badgeContent={selected.filter(i => i === icon).length}
            classes={{
              badge: classes.badge
            }}
            invisible={selected.filter(i => i === icon).length === 0}
          >
            <Button
              style={{
                width: "100%"
              }}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onChange([...selected, icon]);
              }}
            >
              <Icon style={{ overflow: "unset" }}>{icon}</Icon>
            </Button>
          </Badge>
        </div>
      ))
    )(feelings)}
    <div
      style={{
        flexGrow: 1,
        flexBasis: 0,
        textAlign: "center",
        display: "none"
      }}
    >
      <IconButton
        variant={"outlined"}
        disabled={selected.length === 0}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.length === 0) return null;
          onChange([...selected, FEELING_OF_THE_END]);
        }}
      >
        <Icon style={{ overflow: "unset" }}>{FEELING_OF_THE_END}</Icon>
      </IconButton>
    </div>
  </div>
);

export const IndexFeelings = withStyles(styles)(IndexFeelingsWithChip);
