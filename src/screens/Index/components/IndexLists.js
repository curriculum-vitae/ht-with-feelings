import { Typography } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import { flow, map } from "lodash/fp";
import React from "react";

const Progress = ({ percentage, height = 5 }) => {
  const isDone = percentage > 80;
  const palette = isDone ? green : grey;
  return (
    <>
      <div
        style={{
          display: "inline-block",
          height: `${height}px`,
          borderRadius: "2px 0px 0px 2px",
          backgroundColor: `${palette[500]}`,
          width: `${percentage}%`
        }}
      />
      <div
        style={{
          display: isDone ? "none" : "inline-block",
          height: `${height}px`,
          borderRadius: "0px 2px 2px 0px",
          backgroundColor: `${palette[400]}`,
          width: `${100 - percentage}%`
        }}
      />
    </>
  );
};

export const IndexListsItem = ({ list, isSelected, onClick, percentage }) => (
  <div
    onClick={onClick}
    style={{
      display: "inline-block",
      marginRight: "22px"
    }}
  >
    <Typography
      style={{
        cursor: "pointer",
        fontWeight: isSelected ? "bold" : undefined
      }}
      color={isSelected ? "primary" : undefined}
      variant={"button"}
    >
      #{list.name}
    </Typography>

    <div
      style={{
        marginTop: "-2px"
      }}
    >
      <Progress percentage={percentage} />
    </div>
  </div>
);

export const IndexLists = ({ lists, selected, onSelect }) => (
  <>
    <IndexListsItem
      list={{
        name: "all"
      }}
      isSelected={selected === "all"}
      onClick={() => onSelect("all")}
      percentage={Math.random() * 100}
    />
    {flow(
      map(list => (
        <IndexListsItem
          key={list.id}
          list={list}
          isSelected={list.id === selected}
          onClick={() => onSelect(list.id)}
          percentage={Math.random() * 100}
        />
      ))
    )(lists)}
  </>
);
