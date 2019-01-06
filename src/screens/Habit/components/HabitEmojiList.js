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
import { flow, map, reverse, sortBy, findIndex } from "lodash/fp";
import moment from "moment";
import React from "react";

const arrayToIndexedArray = arr => {
  return arr.map((element, index) => ({ element, index }));
};

export const HabitEmojiList = ({ records, onDelete }) => (
  <List dense>
    {flow(
      sortBy(record => record.date.toDate()),
      reverse,
      map(record => (
        <React.Fragment key={record.id}>
          {flow(
            record => record.feelings,
            arrayToIndexedArray,
            map(({ element: emoji, index: position }) => (
              <ListItem key={Math.random()} divider>
                <ListItemAvatar>
                  <Avatar>{emoji}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={moment(record.date.toDate()).format("DD/MM/YYYY")}
                />
                <ListItemSecondaryAction
                  onClick={() => {
                    onDelete({
                      record,
                      emoji,
                      position
                    });
                  }}
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
