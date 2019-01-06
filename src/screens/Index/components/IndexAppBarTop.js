import {
  Typography,
  IconButton,
  Icon,
  Menu,
  Fade,
  MenuItem
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";

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

export const IndexAppBarTop = () => (
  <>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        padding: "16px 32px 0px 16px"
      }}
    >
      <Link to={"/"} style={{ flexGrow: "1", flexBasis: "0" }}>
        <Typography variant={"h4"}>My habits</Typography>
      </Link>
      <FadeMenu />
    </div>
  </>
);
