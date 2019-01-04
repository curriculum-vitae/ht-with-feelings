import { Typography, IconButton, Icon } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";

export const IndexAppBarTop = () => (
  <>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        marginBottom: "16px",
        padding: "16px 32px 0px 16px"
      }}
    >
      <Link to={"/"} style={{ flexGrow: "1", flexBasis: "0" }}>
        <Typography variant={"h4"}>My habits</Typography>
      </Link>
      <IconButton
        onClick={() => {
          if (window.confirm("Log out?")) {
            firebase.auth().signOut();
          }
        }}
      >
        <Icon>exit_to_app</Icon>
      </IconButton>
    </div>
  </>
);
