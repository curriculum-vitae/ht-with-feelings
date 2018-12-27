import { flow, times, sortBy, reverse } from "lodash/fp";
import { getRandomEmotion } from "shared/helpers";

export const generateFakeStat = () => ({
  dates: [new Date(Date.now() - Math.random() * 10000000000)],
  feelings: [getRandomEmotion()]
});

export const generateFakeStats = n =>
  flow(
    times(generateFakeStat),
    sortBy(stat => stat.dates[0]),
    reverse
  )(n);
