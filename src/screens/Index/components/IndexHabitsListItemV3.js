import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { FirebaseContext } from "contexts/FirebaseContext";
import { find, flatten, flow, uniq } from "lodash/fp";
import moment from "moment";
import { FeelingsProvider } from "providers/FeelingsProvider";
import React from "react";
import { Link } from "react-router-dom";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS, FEELING_OF_THE_END } from "shared/constants";
import firebase from "firebase/app";

export const IndexHabitsListItemV3 = ({ habit, feelings, updateFeelings }) => (
  <Card style={{ marginBottom: "16px" }} elevation={0}>
    <CardHeader title={habit.name} />

    <CardActions>
      <IndexFeelings
        feelings={FEELINGS}
        selected={feelings ? feelings.feelings : []}
        onChange={updateFeelings}
      />
    </CardActions>
  </Card>
);
