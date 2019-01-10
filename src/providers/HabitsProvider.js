import React from "react";
import { withState, compose, lifecycle, setDisplayName } from "recompose";
import { FirebaseContext } from "contexts/FirebaseContext";
import firebase from "firebase/app";

export const HabitsProviderWithFirebase = compose(
  withState("habits", "setHabits", []),
  lifecycle({
    componentDidMount() {
      const { db, setHabits } = this.props;
      const { uid } = firebase.auth().currentUser;

      this.unsub = db
        .collection("habits")
        // .where("uid", "==", uid)
        .where("uids", "array-contains", uid)
        .onSnapshot(
          querySnapshot => {
            const result = [];
            querySnapshot.forEach(doc =>
              result.push({
                id: doc.id,
                ...doc.data()
              })
            );
            setHabits(result);
          },
          (err, data) => {
            console.log(err);
          }
        );
    },
    componentWillUnmount() {
      this.unsub();
    }
  }),
  setDisplayName("HabitsProvider")
)(({ children, habits }) =>
  children ? children({ habits: habits.slice(0, 100) }) : null
);

export const HabitsProvider = props => (
  <FirebaseContext.Consumer>
    {db => <HabitsProviderWithFirebase db={db} {...props} />}
  </FirebaseContext.Consumer>
);
