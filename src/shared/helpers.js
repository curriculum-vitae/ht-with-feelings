import { flow, find, filter } from "lodash/fp";

export const getRandomFontSize = () => {
  if (Math.random() > 0.9) return 70;
  if (Math.random() > 0.5) return 60;
  if (Math.random() > 0.4) return 60;
  if (Math.random() > 0.1) return 30;
  return 20;
};

export const isHabitIsFromList = idList => habit => {
  return !!flow(
    habit => habit.lists,
    find(list => list.id === idList)
  )(habit);
};

export const filterHabitsByList = idList => habits => {
  return idList === "all" ? habits : filter(isHabitIsFromList(idList))(habits);
};
