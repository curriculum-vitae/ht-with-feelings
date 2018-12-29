import { withState, setDisplayName, compose } from "recompose";

export const Toggler = compose(
  withState("value", "setValue", ({ initialValue }) => initialValue),
  setDisplayName("Toggler")
)(({ children, value, setValue }) => children({ value, setValue }));
