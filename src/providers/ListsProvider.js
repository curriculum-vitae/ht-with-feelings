import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";

export const ListsProviderWithFirebase = compose(
  withState("lists", "setLists", []),
  lifecycle({
    componentDidMount() {
      const { db, setLists } = this.props;
      db.collection("lists").onSnapshot(querySnapshot => {
        const result = [];
        querySnapshot.forEach(doc =>
          result.push({
            id: doc.id,
            ...doc.data()
          })
        );
        setLists(result);
      });
    }
  })
)(({ children, lists }) => (children ? children({ lists }) : null));

export const ListsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <ListsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
