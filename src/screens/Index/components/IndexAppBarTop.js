import { Typography, IconButton, Icon } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

export const IndexAppBarTop = ({ onClickDate }) => (
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
      <IconButton onClick={onClickDate}>
        <Icon>date_range</Icon>
      </IconButton>
    </div>
  </>
);
