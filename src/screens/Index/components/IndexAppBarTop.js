import { Typography, Button } from "@material-ui/core";
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
        padding: "32px 32px 0px 16px"
      }}
    >
      <Link to={"/"} style={{ flexGrow: "1", flexBasis: "0" }}>
        <Typography variant={"h4"}>My habits</Typography>
      </Link>
      <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
    </div>
  </>
);
