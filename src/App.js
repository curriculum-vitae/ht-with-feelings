import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import React, { Component } from "react";
import { IndexScreen } from "screens/Index";
import { HabitScreen } from "screens/Habit";
import { AuthScreen } from "screens/Auth";
import theme from "shared/theme";
import { FirebaseContext } from "contexts/FirebaseContext";
import { db } from "shared/db";
import { Grid } from "@material-ui/core";
import { Route, Router } from "react-router-dom";
import { history } from "misc/history";
import hot from "react-hot-reload.macro";

class App extends Component {
  render() {
    return (
      <>
        <FirebaseContext.Provider value={db}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container justify={"center"}>
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <Router history={history}>
                  <>
                    <Route path={"/"} exact component={IndexScreen} />
                    <Route path={"/auth"} component={AuthScreen} />
                    <Route path={"/habits/:idHabit"} component={HabitScreen} />
                  </>
                </Router>
              </Grid>
            </Grid>
          </MuiThemeProvider>
        </FirebaseContext.Provider>
      </>
    );
  }
}

export default hot(App);
