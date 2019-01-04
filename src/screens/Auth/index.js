import { StyledFirebaseAuth } from "react-firebaseui";
import React from "react";
import * as firebase from "firebase";
import { Paper, Typography, Button } from "@material-ui/core";

import { Link } from "react-router-dom";

class AuthObserver extends React.Component {
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

class SignInScreen extends React.Component {
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  render() {
    return (
      <AuthObserver>
        {({ isSignedIn }) =>
          !isSignedIn ? (
            <Paper>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </Paper>
          ) : (
            <Paper>
              <Typography variant={"h5"} gutterBottom>
                Hello, {firebase.auth().currentUser.displayName}!
              </Typography>
              <Typography variant={"body1"}>You are now signed-in!</Typography>
              <Button onClick={() => firebase.auth().signOut()}>
                Sign-out
              </Button>

              <Link to={"/"}>
                <Button>Main page</Button>
              </Link>
            </Paper>
          )
        }
      </AuthObserver>
    );
  }
}

export const AuthScreen = () => (
  <div>
    <SignInScreen />
  </div>
);
