import {
  AppBar,
  Fab,
  Fade,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Toolbar
} from "@material-ui/core";
import { Toggler } from "components/Toggler";
import firebase from "firebase/app";
import React from "react";
import { IndexHabitAdd } from "screens/Index/components/IndexHabitAdd";

class FadeMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleLogout = () => {
    if (window.confirm("Log out?")) {
      firebase.auth().signOut();
    }
  };
  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton onClick={this.handleClick}>
          <Icon>more_vert</Icon>
        </IconButton>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem
            onClick={() => {
              this.handleClose();
              this.handleLogout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export const IndexAppBarBottom = () => (
  <div
    style={{
      width: "200px"
    }}
  >
    <AppBar
      color={"default"}
      position={"fixed"}
      style={{
        top: "auto",
        bottom: "0"
      }}
      elevation={1}
    >
      <Toolbar
        style={{
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <IconButton color="inherit" aria-label="Open drawer">
          <Icon>filter_list</Icon>
        </IconButton>

        <Toggler initialValue={false}>
          {({ value, setValue }) => (
            <>
              <IndexHabitAdd isOpen={value} onClose={() => setValue(false)} />
              <Fab
                color={"secondary"}
                aria-label={"Add"}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: -30,
                  left: 0,
                  right: 0,
                  margin: "0 auto"
                }}
                onClick={() => {
                  setValue(true);
                }}
              >
                <Icon>add</Icon>
              </Fab>
            </>
          )}
        </Toggler>
        <FadeMenu />
      </Toolbar>
    </AppBar>
  </div>
);
