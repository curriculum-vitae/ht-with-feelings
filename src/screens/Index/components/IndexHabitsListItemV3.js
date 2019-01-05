import { Card, CardActions, CardHeader } from "@material-ui/core";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

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
