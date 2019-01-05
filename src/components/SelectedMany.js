import { compose, withStateHandlers } from "recompose";
import { filter, flow } from "lodash/fp";

export const SelectedMany = compose(
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
      })
    }
  )
)(({ children, ...props }) => children({ ...props }));
