import {
  flow,
  times,
  toPairs,
  sortBy,
  reverse,
  filter,
  map,
  flatten,
  reduce
} from "lodash/fp";
import { getRandomEmotion } from "shared/helpers";
import getRandomEmoji from "lib/random-emoji";

export const generateFakeStat = () => ({
  dates: [new Date(Date.now() - Math.random() * 10000000000)],
  feelings: [getRandomEmoji()]
});

export const generateFakeStats = n =>
  flow(
    times(generateFakeStat),
    sortBy(stat => stat.dates[0]),
    reverse
  )(n);

export const getEmojis = flow(
  filter(record => !!record.feelings),
  filter(record => record.feelings.length > 0),
  map(record => record.feelings),
  flatten
);

const logAndPass = arg => {
  console.log(arg);
  return arg;
};

export const getStats = flow(
  getEmojis,
  // logAndPass,
  emojis => {
    return emojis.reduce((stats, emoji) => {
      stats.count = stats.count || 0;
      stats.count++;

      stats.occurence = stats.occurence || {};
      stats.occurence[emoji] = stats.occurence[emoji] || 0;
      stats.occurence[emoji]++;

      return stats;
    }, {});
  }
);

export const getStatsItems = stats => {
  const { count: countOfAll, occurence } = stats;

  return flow(
    toPairs,
    map(([emoji, count]) => ({
      emoji,
      count,
      percentagae: count / countOfAll
    }))
  )(occurence);
};
