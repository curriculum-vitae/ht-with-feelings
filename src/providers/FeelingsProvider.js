import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";

export const FeelingsProviderWithFirebase = compose(
  withState("feelings", "setFeelings", []),
  lifecycle({
    componentDidMount() {
      const { db, idHabit, setFeelings } = this.props;
      const { uid } = firebase.auth().currentUser;
      this.unsub = db
        .collection("records")
        .where("idHabit", "==", idHabit)
        .where("uid", "==", uid)
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
