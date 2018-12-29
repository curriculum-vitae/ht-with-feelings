import React from "react";
import { compose, withStateHandlers, setDisplayName } from "recompose";
import moment from "moment";

const addBehavior = compose(
  withStateHandlers(
    ({ initialDate }) => ({
      date: initialDate
    }),
    {
      setDate: () => date => ({
        date
      }),
      setDatePrev: ({ date }) => () => ({
        date: moment(date).add(-1, "day")
      }),
      setDateNext: ({ date }) => () => ({
        date: moment(date).add(1, "day")
      })
    }
  ),
  setDisplayName("DayPicker")
);

export const IndexDayPicker = addBehavior(
  ({ date, setDate, setDateNext, setDatePrev, children }) =>
    children({
      date,
      setDate,
      setDateNext,
      setDatePrev
    })
);
