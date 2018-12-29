import { compose, withStateHandlers } from "recompose";
import { filter } from "lodash/fp";

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
        selected: filter(item => item.id !== id)(props.selected)
      })
    }
  )
)(({ children, ...props }) => children({ ...props }));
