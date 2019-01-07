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
import { getRandomEmoji } from "lib/random-emoji";
//
import Slider from "@material-ui/lab/Slider";

const FEELINGS_RANDOM = [getRandomEmoji(), getRandomEmoji(), getRandomEmoji()];

export const IndexHabitsListItemV3 = ({ habit, feelings, updateFeelings }) => (
  <Card
    style={{
      marginBottom: "16px",
      border: `1px solid ${grey[200]}`
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
      {Math.random() > 0.1 ? (
        <IndexFeelings
          feelings={FEELINGS}
          selected={feelings ? feelings.feelings : []}
          onChange={updateFeelings}
        />
      ) : (
        <div style={{ padding: "20px", width: "100%" }}>
          <Slider value={0} min={0} max={6} step={1} />
        </div>
      )}
    </CardActions>
  </Card>
);
