import {
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Icon
} from "@material-ui/core";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";
import { grey } from "@material-ui/core/colors";

import Slider from "@material-ui/lab/Slider";

export const IndexHabitsListItemV3 = ({ habit, feelings, updateFeelings }) => (
  <Card
    style={{
      marginBottom: "16px",
      border: `1px solid ${grey[200]}`,
      backgroundColor: "unset"
    }}
    elevation={0}
  >
    <CardHeader
      title={habit.name}
      action={
        <IconButton>
          <Icon>more_vert</Icon>
        </IconButton>
      }
    />

    <CardActions>
      <IndexFeelings
        feelings={FEELINGS}
        selected={feelings ? feelings.feelings : []}
        onChange={updateFeelings}
      />
    </CardActions>
  </Card>
);
