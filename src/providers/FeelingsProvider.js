import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";

export const FeelingsProviderWithFirebase = compose(
  withState("feelings", "setFeelings", []),
  lifecycle({
    componentDidMount() {
      const { db, idHabit, setFeelings } = this.props;
      this.unsub = db
        .collection("records")
        .where("idHabit", "==", idHabit)
        .onSnapshot(querySnapshot => {
          const result = [];
          querySnapshot.forEach(doc =>
            result.push({
              id: doc.id,
              ...doc.data()
            })
          );
          setFeelings(result);
        });
    },
    componentWillUnmount() {
      this.unsub();
    }
  })
)(({ children, feelings }) => (children ? children({ feelings }) : null));

export const FeelingsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <FeelingsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
