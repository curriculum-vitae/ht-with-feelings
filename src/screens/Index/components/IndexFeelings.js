import { Badge, Chip, Icon, Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { flow, map } from "lodash/fp";
import React from "react";
import { FEELING_OF_THE_END } from "shared/constants";

const styles = theme => ({
  badge: {
    top: 10,
    right: -18,
    // The border color match the background color.
    backgroundColor: theme.palette.grey[200],
    border: `3px solid ${
      theme.palette.type === "light" ? "white" : theme.palette.grey[900]
    }`
  }
});

const IndexFeelingsListItem = ({
  classes,
  badgeContent = "",
  badgeIsInvisible,
  onClick,
  icon,
  disabled = false,
  label
}) => (
  <div
    key={icon}
    style={{
      flexGrow: 1,
      flexBasis: 0,
      textAlign: "center"
    }}
  >
    <div onClick={onClick}>
      <Button disabled={disabled} size={"large"} style={{ width: "100%" }}>
        <Badge
          badgeContent={badgeContent}
          classes={{
            badge: classes.badge
          }}
          invisible={badgeIsInvisible}
        >
          {!!icon ? <Icon style={{ overflow: "unset" }}>{icon}</Icon> : null}
          {label}
        </Badge>
      </Button>
    </div>
  </div>
);

const IndexFeelingsList = ({
  feelings,
  selected = [],
  onChange,
  classes,
  showBadge = true,
  showCommitButton
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
              key={icon}
              badgeContent={countOfIcon}
              badgeIsInvisible={!showBadge || countOfIcon === 0}
              classes={classes}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onChange([...selected, icon]);
                /*
                if (selected.includes(icon)) {
                  onChange([]);
                } else {
                  onChange([icon]);
                }
                */
              }}
              icon={icon}
            />
          );
        })
      )(feelings)}

      {showCommitButton ? (
        <IndexFeelingsListItem
          badgeIsInvisible={true}
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            if (selected.length === 0) return null;
            onChange([...selected, FEELING_OF_THE_END]);
          }}
          disabled={selected.length === 0}
          classes={classes}
          icon={"save"}
        />
      ) : null}
    </div>
  );
};

export const IndexFeelings = withStyles(styles)(IndexFeelingsList);
