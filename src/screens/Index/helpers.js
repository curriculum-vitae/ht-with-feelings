import moment from "moment";
import { flow, filter, find } from "lodash/fp";

export const formatMomentForCalendarHeader = mDate => {
  var fromNow = mDate.fromNow();
  return mDate.calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: "[Last] dddd",
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd",
    // when the date is further away, use from-now functionality
    sameElse: function() {
      return "[" + fromNow + "]";
    }
  });
};
