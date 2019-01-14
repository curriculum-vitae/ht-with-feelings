import { FirebaseContext } from "contexts/FirebaseContext";
import { flow, sortBy } from "lodash/fp";
import React from "react";
import { compose, lifecycle, withState } from "recompose";
import firebase from "firebase/app";

export const ListsProviderWithFirebase = compose(
  withState("lists", "setLists", []),
  lifecycle({
    componentDidMount() {
      const { db, setLists } = this.props;
      const { uid } = firebase.auth().currentUser;

      const onShapshot = querySnapshot => {
        const result = [];
        querySnapshot.forEach(doc =>
          result.push({
            id: doc.id,
            ...doc.data()
          })
        );
        flow(
          sortBy(list => list.position),
          setLists
        )(result);
      };
      const onError = err => {
        console.log(err);
        setLists([]);
      };
      this.unsub = db
        .collection("lists")
        .where("uid", "==", uid)
        .onSnapshot(onShapshot, onError);
    },
    componentWillUnmount() {
      this.unsub();
    }
  })
)(({ children, lists }) => (children ? children({ lists }) : null));

export const ListsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <ListsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
