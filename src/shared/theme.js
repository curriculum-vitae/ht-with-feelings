import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

const THEMES = {};
const THEME_TO_USE = "light";

const SHAPE = {
  shape: {
    borderRadius: "8px"
  }
};

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
  },
  ...SHAPE
};

THEMES["light"] = {
  palette: {
    background: {}
  },
  ...SHAPE
};

export default createMuiTheme(THEMES[THEME_TO_USE]);
