import React from "react";
import { withState, compose, lifecycle, setDisplayName } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";

export const RecordsProviderWithFirebase = compose(
  withState("data", "setData", []),
  lifecycle({
    componentDidMount() {
      const { db, setData } = this.props;
      const { uid } = firebase.auth().currentUser;
      this.unsub = db
        .collection("records")
        //.where("uid", "==", uid)
        .onSnapshot(querySnapshot => {
          const result = [];
          querySnapshot.forEach(doc =>
            result.push({
              id: doc.id,
              ...doc.data()
            })
          );
          setData(result);
        });
    },
    componentWillUnmount() {
      this.unsub();
    }
  }),
  setDisplayName("RecordsProvider")
)(({ children, data }) => (children ? children({ records: data }) : null));

export const RecordsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <RecordsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
