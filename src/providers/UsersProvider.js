import React from "react";
import { withState, compose, lifecycle } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";
import { flow, filter } from "lodash/fp";

const mapQuerySnapshotToDocuments = querySnapshot => {
  const r = [];

  querySnapshot.forEach(doc => {
    r.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return r;
};

export const UsersProviderWithFirebase = compose(
  withState("users", "setUsers", []),
  lifecycle({
    componentDidMount() {
      const { db, ids, setUsers } = this.props;

      this.unsub = db.collection("users").onSnapshot(querySnapshot => {
        flow(
          mapQuerySnapshotToDocuments,
          ids ? filter(d => ids.includes(d.id)) : d => d,
          users => setUsers(users)
        )(querySnapshot);
      });
    },
    componentWillUnmount() {
      this.unsub();
    }
  })
)(({ children, users }) => (children ? children({ users }) : null));

export const UsersProvider = props => (
  <FirebaseContext.Consumer>
    {db => <UsersProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
