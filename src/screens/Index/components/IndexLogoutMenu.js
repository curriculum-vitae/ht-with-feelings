import { Fade, Icon, IconButton, Menu, MenuItem } from "@material-ui/core";
import firebase from "firebase/app";
import React from "react";

export class IndexLogoutMenu extends React.Component {
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
        <IconButton onClick={this.handleClick} color={"default"}>
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
