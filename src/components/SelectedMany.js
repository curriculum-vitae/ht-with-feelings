import { compose, withStateHandlers, setDisplayName } from "recompose";
import { filter, flow } from "lodash/fp";

export const SelectedMany = compose(
  setDisplayName("SelectedMany"),
  withStateHandlers(
    props => ({
      selected: props.initialSelected
    }),
    {
      add: props => id => ({
        selected: [...props.selected, id]
      }),
      remove: props => id => ({
        selected: flow(
          props => props.selected,
          filter(item => item !== id)
        )(props)
      }),
      toggle: props => id => {
        if (props.selected.includes(id)) {
          return {
            selected: flow(
              props => props.selected,
              filter(item => item !== id)
            )(props)
          };
        } else {
          return {
            selected: [...props.selected, id]
          };
        }
      }
    }
  )
)(({ children, ...props }) => children({ ...props }));
