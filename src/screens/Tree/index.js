import React from "react";
import { flow, map, toPairs } from "lodash/fp";
import { Chip, Icon, Divider, IconButton, Typography } from "@material-ui/core";

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
  0: 50,
  1: 20,
  2: 10
};

const Tree = ({ title, items, depth }) => (
  <>
    <br />
    <br />
    <div style={{ display: "flex", marginBottom: "0px" }}>
      <IconButton style={{ marginTop: "-12px" }}>
        <Icon>done_all</Icon>
      </IconButton>
      <div style={{ textAlign: "center", width: "100%" }}>
        <Typography align={"center"} variant={"h6"} gutterBottom>
          {title}
        </Typography>
      </div>
      <IconButton style={{ marginTop: "-12px" }}>
        <Icon>graphic_eq</Icon>
      </IconButton>
    </div>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "4px",
          display: "inline-block",

          marginBottom: "10px",
          textAlign: "center",
          backgroundColor: "grey",
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
          <IconButton style={{ marginTop: "-12px" }}>
            <Icon>check</Icon>
          </IconButton>
          <div style={{ textAlign: "center", width: "100%" }}>
            {item.name}
            {!!item.stages ? (
              <div style={{ fontSize: "10px", color: "grey" }}>
                {item.stages[0]}
              </div>
            ) : null}
          </div>
          <IconButton style={{ marginTop: "-12px" }}>
            <Icon>more_vert</Icon>
          </IconButton>
        </div>

        <div
          style={{
            width: "4px",
            display: "inline-block",

            marginBottom: "10px",
            textAlign: "center",
            backgroundColor: "grey",
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
  <div>
    <br />
    <br />
    <br />
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Chip label={"Morning"} />
      <Chip label={"Day"} />
      <Chip label={"Evening"} />
      <Chip label={"Anytime"} />
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
