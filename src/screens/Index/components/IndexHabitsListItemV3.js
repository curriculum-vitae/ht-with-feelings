import {
  Card,
  CardActions,
  CardHeader,
  Icon,
  IconButton
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

export const IndexHabitsListItemV3 = ({
  habit,
  record,
  onChangeHabitEmojis
}) => (
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
        selected={record ? record.feelings : []}
        onChange={onChangeHabitEmojis}
      />
    </CardActions>
  </Card>
);
