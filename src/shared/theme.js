import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

const THEMES = {};
const THEME_TO_USE = "dark";

THEMES["dark"] = {
  palette: {
    type: "dark",
    background: {
      default: "black",
      paper: "#111"
    },
    primary: teal,
    secondary: red
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "black"
      }
    }
  }
};

THEMES["light"] = {
  palette: {
    background: {}
  }
};

export default createMuiTheme(THEMES[THEME_TO_USE]);
