import { StyledFirebaseAuth } from "react-firebaseui";
import React from "react";
import * as firebase from "firebase";
import { Paper, Typography } from "@material-ui/core";

import { Redirect } from "react-router-dom";

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
            <Redirect to={"/"} />
          ) : (
            <Paper
              style={{
                height: "100vh",
                paddingTop: "25%"
              }}
            >
              <Typography variant={"h4"} gutterBottom align={"center"}>
                Log in
              </Typography>
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
