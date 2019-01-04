import { StyledFirebaseAuth } from "react-firebaseui";
import React from "react";
import * as firebase from "firebase";
import { Paper, Typography, Button } from "@material-ui/core";

import { Link } from "react-router-dom";

import { AuthObserver } from "features/AuthObserver";

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
          isSignedIn ? (
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
          ) : (
            <Paper>
              <StyledFirebaseAuth
                uiConfig={this.uiConfig}
                firebaseAuth={firebase.auth()}
              />
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
