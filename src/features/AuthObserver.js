import React from "react";
import * as firebase from "firebase";

export class AuthObserver extends React.Component {
  // The component's Local state.
  state = {
    isSignedIn: false
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({ isSignedIn: !!user }));
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render() {
    const { children } = this.props;
    const { isSignedIn } = this.state;
    return children({ isSignedIn });
  }
}
