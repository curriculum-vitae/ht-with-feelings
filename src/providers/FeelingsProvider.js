import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";

export const FeelingsProviderWithFirebase = compose(
  withState("feelings", "setFeelings", []),
  lifecycle({
    componentDidMount() {
      const { db, idHabit, setFeelings } = this.props;
      db.collection("habits")
        .doc(idHabit)
        .collection("feelings")
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
    }
  })
)(({ children, feelings }) => (children ? children({ feelings }) : null));

export const FeelingsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <FeelingsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
