import { Badge, Chip, Icon, Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { flow, map } from "lodash/fp";
import React from "react";
import { FEELING_OF_THE_END } from "shared/constants";

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
  classes,
  showBadge = false
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        marginRight: "4px"
      }}
    >
      {flow(
        map(icon => {
          const countOfIcon = selected.filter(i => i === icon).length;
          return (
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
                badgeContent={countOfIcon}
                classes={{
                  badge: classes.badge
                }}
                invisible={!showBadge || countOfIcon === 0}
              >
                <Button
                  style={{
                    width: "100%"
                  }}
                  variant={countOfIcon > 0 ? "outlined" : undefined}
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    // onChange([...selected, icon]);
                    if (selected.includes(icon)) {
                      onChange([]);
                    } else {
                      onChange([icon]);
                    }
                  }}
                >
                  <Icon style={{ overflow: "unset" }}>{icon}</Icon>
                </Button>
              </Badge>
            </div>
          );
        })
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
};

export const IndexFeelings = withStyles(styles)(IndexFeelingsWithChip);
