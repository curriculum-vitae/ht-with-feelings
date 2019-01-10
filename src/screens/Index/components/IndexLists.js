import { Typography } from "@material-ui/core";
import { flow, map } from "lodash/fp";
import React from "react";
import { IndexListsProgress } from "screens/Index/components/IndexListsProgress";

export const IndexListsItem = ({ list, isSelected, onClick, percentage }) => (
  <div
    onClick={onClick}
    style={{
      display: "inline-block",
      marginRight: "22px",
      cursor: "pointer"
    }}
  >
    <Typography
      style={{
        cursor: "pointer",
        fontWeight: isSelected ? "bold" : undefined
      }}
      color={isSelected ? "primary" : undefined}
      variant={"subtitle2"}
    >
      #{list.name}
    </Typography>

    <div
      style={{
        marginTop: "-8px"
      }}
    >
      <IndexListsProgress percentage={percentage} />
    </div>
  </div>
);

export const IndexLists = ({ lists, selected, onSelect, progress }) => (
  <>
    <IndexListsItem
      list={{
        name: "all"
      }}
      isSelected={selected === "all"}
      onClick={() => onSelect("all")}
      percentage={progress}
    />
    {flow(
      map(list => (
        <IndexListsItem
          key={list.id}
          list={list}
          isSelected={list.id === selected}
          onClick={() => onSelect(list.id)}
          percentage={list.progress}
        />
      ))
    )(lists)}
  </>
);
