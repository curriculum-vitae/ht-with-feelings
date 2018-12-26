import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import { IndexScreen } from "screens/Index";
import theme from "theme.js";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <IndexScreen />
      </MuiThemeProvider>
    );
  }
}

export default App;
