import React from "react";

import { ChartConfig } from "components/ChartConfig";
import { Chart } from "react-charts";

export const HabitChartWeekly = () => (
  <div>
    <ChartConfig series={3}>
      {({ data }) => (
        <Chart
          data={data}
          series={{
            showPoints: false
          }}
          axes={[
            { primary: true, type: "time", position: "bottom" },
            { type: "linear", position: "left" }
          ]}
          tooltip
        />
      )}
    </ChartConfig>
  </div>
);
