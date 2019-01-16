import React from "react";
import ReactDOM from "react-dom";
import "index.css";
import App from "App.js";
import * as serviceWorker from "serviceWorker.js";
import ReactGA from "react-ga";
import { history } from "misc/history";

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-49161653-4");
  history.listen(() => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  });
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
