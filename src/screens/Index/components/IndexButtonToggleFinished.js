import { Button } from "@material-ui/core";
import React from "react";

export const IndexButtonToggleFinished = ({ ...props }) => (
  <Button
    variant={"outlined"}
    style={{
      width: "100%"
    }}
    {...props}
  />
);
