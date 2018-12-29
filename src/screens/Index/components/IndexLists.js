import React from "react";
import { Chip, ButtonBase, Button } from "@material-ui/core";
import { flow, map } from "lodash/fp";

export const IndexLists = ({ lists, selected }) => (
  <>
    {flow(
      map(list => (
        <ButtonBase key={list.id} style={{ cursor: "pointer" }}>
          <Chip
            style={{ marginRight: "4px", cursor: "pointer" }}
            variant={list.id === selected ? undefined : "outlined"}
            label={list.name}
          />
        </ButtonBase>
      ))
    )(lists)}
  </>
);
