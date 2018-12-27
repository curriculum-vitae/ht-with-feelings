import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";

export const HabitsProviderWithFirebase = compose(
  withState("habits", "setHabits", []),
  lifecycle({
    componentDidMount() {
      const { db, setHabits } = this.props;
      db.collection("habits").onSnapshot(querySnapshot => {
        const result = [];
        querySnapshot.forEach(doc =>
          result.push({
            id: doc.id,
            ...doc.data()
          })
        );
        setHabits(result);
      });
    }
  })
)(({ children, habits }) => (children ? children({ habits }) : null));

export const HabitsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <HabitsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
