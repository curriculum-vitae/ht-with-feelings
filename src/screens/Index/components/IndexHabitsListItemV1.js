import { Divider, Grid, Typography } from "@material-ui/core";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

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
