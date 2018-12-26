import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import { IndexScreen } from "screens/Index";
import theme from "shared/theme";
import { FirebaseContext } from "contexts/FirebaseContext";
import { db } from "shared/db";

class App extends Component {
  render() {
    return (
      <>
        <FirebaseContext.Provider value={db}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <IndexScreen />
          </MuiThemeProvider>
        </FirebaseContext.Provider>
      </>
    );
  }
}

export default App;
