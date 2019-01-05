import {
  Avatar,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import { flow, uniq } from "lodash/fp";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";

export const IndexHabitsListItemV2 = ({ habit, feelings, updateFeelings }) => (
  <ListItem divider>
    <Avatar>+</Avatar>

    <ListItemText
      primary={habit.name}
      primaryTypographyProps={{
        noWrap: true
      }}
    />
    <ListItemSecondaryAction>
      <IndexFeelings
        feelings={flow(
          feelings => (!!feelings ? feelings.feelings : []),
          uniq
        )(feelings)}
        selected={feelings ? feelings.feelings : []}
        onChange={updateFeelings}
      />
    </ListItemSecondaryAction>
  </ListItem>
);
