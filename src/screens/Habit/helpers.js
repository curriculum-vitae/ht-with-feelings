import { getRandomEmoji } from "lib/random-emoji";
import {
  filter,
  flatten,
  flow,
  map,
  reverse,
  sortBy,
  times,
  compact,
  toPairs
} from "lodash/fp";

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

export const getStats = flow(
  getEmojis,
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
      percentage: count / countOfAll
    }))
  )(occurence);
};

export const getPopularityScale = from => to => percentage => {
  return from + (to - from) * percentage;
};

export const isRecordsHasNoFeelings = records =>
  flow(
    records => records || [],
    map(record => record.feelings),
    flatten,
    compact,
    arr => arr.length === 0
  )(records);
