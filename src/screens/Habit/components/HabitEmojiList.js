import {
  Avatar,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import { flow, map, reverse, sortBy } from "lodash/fp";
import moment from "moment";
import React from "react";

export const HabitEmojiList = ({ records, onDelete }) => (
  <List dense>
    {flow(
      sortBy(record => record.date.toDate()),
      reverse,
      map(record => (
        <React.Fragment key={record.id}>
          {flow(
            record => record.feelings,
            reverse,
            map(emoji => (
              <ListItem key={Math.random()} divider>
                <ListItemAvatar>
                  <Avatar>{emoji}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={moment(record.date.toDate()).format("DD/MM/YYYY")}
                />
                <ListItemSecondaryAction
                  onClick={() =>
                    onDelete({
                      record,
                      emoji,
                      position: record.feelings.indexOf(emoji)
                    })
                  }
                >
                  <IconButton>
                    <Icon>remove</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )(record)}
        </React.Fragment>
      ))
    )(records)}
  </List>
);
