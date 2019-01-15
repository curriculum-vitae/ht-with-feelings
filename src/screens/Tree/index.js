import React from "react";
import { flow, map, toPairs } from "lodash/fp";
import { Chip, Icon, Divider, IconButton, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

const TREE = {
  0: {
    name: "Make my bed",
    when: "morning"
  },
  1: {
    name: "Drink water with lemon",
    when: "morning"
  },
  2: {
    name: "Avoid wasting time in bed",
    when: "morning"
  },
  3: {
    name: "Avoid coffee",
    when: "morning",
    stages: ["Wait 30 minutes after waking up"]
  },
  4: {
    name: "Avoid knee locking",
    when: "morning",
    stages: ["Sit cool for 1 minute"]
  },
  5: {
    name: "Use Pomodoro",
    tree: {
      0: {
        name: "3 times per day"
      }
    }
  }
};

const convertTree = flow(
  toPairs,
  map(([a, b]) => ({
    id: a,
    ...b
  }))
);

const MAP_OF_DEPTHS_TO_LENGTH = {
  0: 40,
  1: 20,
  2: 10
};

const Tree = ({ title, items, depth }) => (
  <>
    <br />
    <br />
    <div style={{ display: "flex", marginBottom: "0px" }}>
      <IconButton style={{ marginTop: "-8px" }}>
        <Icon>done_all</Icon>
      </IconButton>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Typography align={"center"} variant={"h6"} gutterBottom>
          {title}
        </Typography>
      </div>
      <IconButton style={{ marginTop: "-8px" }}>
        <Icon>poll</Icon>
      </IconButton>
    </div>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "2px",
          display: "inline-block",

          marginBottom: "10px",
          textAlign: "center",
          backgroundColor: grey[400],
          height: `${MAP_OF_DEPTHS_TO_LENGTH[depth]}px`
        }}
      />
    </div>
    {map(item => (
      <div
        key={item.id}
        style={{
          textAlign: "center"
        }}
      >
        <div style={{ display: "flex" }}>
          <IconButton style={{ marginTop: "-8px" }}>
            <Icon>check</Icon>
          </IconButton>
          <div style={{ textAlign: "center", width: "100%" }}>
            <Typography align={"center"} variant={"subtitle1"}>
              {item.name}
            </Typography>
            {!!item.stages ? (
              <div style={{ fontSize: "10px", color: "grey" }}>
                {item.stages[0]}
              </div>
            ) : null}
          </div>
          <IconButton style={{ marginTop: "-8px" }}>
            <Icon>more_vert</Icon>
          </IconButton>
        </div>

        <div
          style={{
            width: "2px",
            display: "inline-block",

            marginBottom: "10px",
            textAlign: "center",
            backgroundColor: grey[400],
            height: `${MAP_OF_DEPTHS_TO_LENGTH[depth]}px`
          }}
        />
      </div>
    ))(items)}
    <div style={{ textAlign: "center" }}>
      <IconButton>
        <Icon>add</Icon>
      </IconButton>
    </div>
    <br />
    <br />
    <Divider />
  </>
);

const TreeRoot = ({ tree }) => (
  <div style={{ padding: "40px 16px" }}>
    <Typography variant={"h4"} gutterBottom>
      My Routines
    </Typography>

    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Chip
        variant={"outlined"}
        label={"Morning"}
        style={{ marginRight: "10px" }}
        color={"primary"}
      />
      <Chip
        variant={"outlined"}
        label={"Day"}
        style={{ marginRight: "10px" }}
      />
      <Chip
        variant={"outlined"}
        label={"Evening"}
        style={{ marginRight: "10px" }}
      />
      <Chip
        variant={"outlined"}
        label={"Anytime"}
        style={{ marginRight: "10px" }}
      />
    </div>

    <Tree title={"Routine #1"} items={convertTree(TREE)} depth={0} />

    <Tree title={"Routine #2"} items={convertTree(TREE)} depth={0} />

    <br />
    <br />
    <div style={{ textAlign: "center" }}>
      <IconButton>
        <Icon>add</Icon>
      </IconButton>
    </div>
    <br />
    <br />
  </div>
);

export const TreeScreen = () => (
  <>
    <TreeRoot />
  </>
);
