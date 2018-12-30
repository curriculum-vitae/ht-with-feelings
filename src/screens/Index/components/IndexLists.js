import React from "react";
import { Chip, ButtonBase, Button, Avatar, Icon } from "@material-ui/core";
import { flow, map, sortBy } from "lodash/fp";

export const IndexLists = ({ lists, selected, onSelect }) => (
  <>
    {flow(
      map(list => (
        <ButtonBase key={list.id} style={{ cursor: "pointer" }}>
          <Chip
            style={{
              marginRight: "4px",
              cursor: "pointer"
            }}
            variant={"outlined"}
            color={list.id === selected ? "primary" : undefined}
            label={list.name}
            onClick={() => onSelect(list.id)}
          />
        </ButtonBase>
      ))
    )(lists)}
  </>
);
