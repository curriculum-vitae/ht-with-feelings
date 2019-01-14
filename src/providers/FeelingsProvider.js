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

      const onSnapshot = querySnapshot => {
        const result = [];
        querySnapshot.forEach(doc =>
          result.push({
            id: doc.id,
            ...doc.data()
          })
        );
        setFeelings(result);
      };

      const onError = err => {
        console.log(err);
      };

      this.unsub = db
        .collection("records")
        .where("idHabit", "==", idHabit)
        .where("uid", "==", uid)
        .onSnapshot(onSnapshot, onError);
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
