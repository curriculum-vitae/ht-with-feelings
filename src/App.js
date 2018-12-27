import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import { IndexScreen } from "screens/Index";
import { HabitScreen } from "screens/Habit";
import theme from "shared/theme";
import { FirebaseContext } from "contexts/FirebaseContext";
import { db } from "shared/db";

import { Route, Router } from "react-router-dom";
import { history } from "misc/history";

class App extends Component {
  render() {
    return (
      <>
        <FirebaseContext.Provider value={db}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Router history={history}>
              <>
                <Route path={"/"} exact component={IndexScreen} />
                <Route path={"/habits/:idHabit"} component={HabitScreen} />
              </>
            </Router>
          </MuiThemeProvider>
        </FirebaseContext.Provider>
      </>
    );
  }
}

export default App;
