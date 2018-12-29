import { compose, withState } from "recompose";

export const SelectedOnce = compose(
  withState("selected", "setSelected", ({ initialSelected }) => initialSelected)
)(({ selected, setSelected, children }) => children({ selected, setSelected }));
