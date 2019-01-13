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

const IndexFeelingsListItem = ({
  classes,
  badgeContent,
  badgeIsInvisible,
  onClick,
  icon
}) => (
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
      badgeContent={badgeContent}
      classes={{
        badge: classes.badge
      }}
      invisible={badgeIsInvisible}
    >
      <Button
        style={{
          width: "100%"
        }}
        onClick={onClick}
      >
        <Icon style={{ overflow: "unset" }}>{icon}</Icon>
      </Button>
    </Badge>
  </div>
);

const IndexFeelingsList = ({
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
            <IndexFeelingsListItem
              badgeContent={countOfIcon}
              badgeIsInvisible={!showBadge || countOfIcon === 0}
              classes={classes}
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
              icon={icon}
            />
          );
        })
      )(feelings)}

      <IndexFeelingsListItem
        badgeIsInvisible={true}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          if (selected.length === 0) return null;
          onChange([...selected, FEELING_OF_THE_END]);
        }}
        classes={classes}
        icon={FEELING_OF_THE_END}
      />
    </div>
  );
};

export const IndexFeelings = withStyles(styles)(IndexFeelingsList);
