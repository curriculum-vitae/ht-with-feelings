import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    /*
    type: "dark",
    */
    background: {
      /*
      default: "black",
      paper: "#111"
      */
    }
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    /*
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "black"
      }
    }
    */
  }
});
