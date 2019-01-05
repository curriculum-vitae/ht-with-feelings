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

export const IndexHabitsListItemV1 = ({ habit, feelings, updateFeelings }) => (
  <>
    <Grid container spacing={0} style={{ marginTop: "4px" }}>
      <Grid item xs={7}>
        <Typography noWrap={true} variant={"subtitle1"}>
          {habit.name}
        </Typography>
      </Grid>
      <Grid item xs={5}>
        <IndexFeelings
          feelings={FEELINGS}
          selected={feelings ? feelings.feelings : []}
          onChange={updateFeelings}
        />
      </Grid>
    </Grid>
    <Divider />
  </>
);
