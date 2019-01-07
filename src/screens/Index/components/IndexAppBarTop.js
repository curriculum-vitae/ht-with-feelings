import { Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

export const IndexAppBarTop = () => (
  <>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        marginTop: "16px",
        marginBottom: "8px",
        padding: "16px 32px 0px 16px"
      }}
    >
      <Link to={"/"} style={{ flexGrow: "1", flexBasis: "0" }}>
        <Typography variant={"h4"}>My habits</Typography>
      </Link>
    </div>
  </>
);
