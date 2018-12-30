import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

const dark = {
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

const light = {
  palette: {
    background: {}
  },
  shape: {
    borderRadius: 12
  }
};

export default createMuiTheme(light);
