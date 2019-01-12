import { Grid, Typography } from "@material-ui/core";
import { filter, flow, map } from "lodash/fp";
import React from "react";
import { RANGE_OF_EMOJI } from "screens/Habit/constants";
import { getPopularityScale } from "screens/Habit/helpers";
import { FEELING_OF_THE_END } from "shared/constants";

export const HabitEmojiOverview = ({ statsItems }) => (
  <Grid container spacing={40}>
    {flow(
      filter(statsItem => statsItem.emoji !== FEELING_OF_THE_END),
      map(statsItem => {
        const size = getPopularityScale(RANGE_OF_EMOJI[0])(RANGE_OF_EMOJI[1])(
          statsItem.percentage
        );
        return (
          <Grid
            item
            xs={6}
            style={{ textAlign: "center" }}
            key={statsItem.emoji}
          >
            <div
              style={{
                fontSize: `${size}px`,
                paddingTop: `${(RANGE_OF_EMOJI[1] - size) / 1.5}px`,
                height: `${RANGE_OF_EMOJI[1]}px`
              }}
            >
              {statsItem.emoji}
            </div>

            <Typography variant={"caption"} style={{ marginTop: "18px" }}>
              {String((statsItem.percentage * 100) / 1).slice(0, 4)}%
            </Typography>
          </Grid>
        );
      })
    )(statsItems)}
  </Grid>
);
