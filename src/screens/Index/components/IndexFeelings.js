import { Badge, Chip, Icon } from "@material-ui/core";
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
      display: "flex"
    }}
  >
    {flow(
      map(icon => (
        <Badge
          style={{
            flexGrow: 1,
            flexBasis: 0
          }}
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
              width: `100%`,
              opacity: selected.includes(icon) ? undefined : "0.3",
              fontSize: `${EMOJI_SIZE}px`,
              marginRight: "px"
            }}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onChange([...selected, icon]);
            }}
            label={icon}
          />
        </Badge>
      ))
    )(feelings)}
    <Chip
      variant={"outlined"}
      style={{
        opacity: selected.length > 0 ? "1" : "0.2",
        marginLeft: "16px",
        fontSize: `${EMOJI_SIZE}px`,
        width: `${EMOJI_SIZE + 32}px`,
        border: "0px"
      }}
      icon={<Icon style={{ marginLeft: "22px" }}>send</Icon>}
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        if (selected.length === 0) return null;
        onChange([...selected, FEELING_OF_THE_END]);
      }}
    />
  </div>
);

export const IndexFeelings = withStyles(styles)(IndexFeelingsWithChip);
