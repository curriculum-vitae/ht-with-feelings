import { AppBar, Fab, Icon, IconButton, Toolbar } from "@material-ui/core";
import { Toggler } from "components/Toggler";
import React from "react";
import { IndexHabitAdd } from "screens/Index/components/IndexHabitAdd";

export const IndexAppBarBottom = () => (
  <div
    style={{
      width: "200px"
    }}
  >
    <AppBar
      color={"default"}
      position={"fixed"}
      style={{
        top: "auto",
        bottom: "0"
      }}
      elevation={1}
    >
      <Toolbar
        style={{
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <IconButton color="inherit" aria-label="Open drawer">
          <Icon>filter_list</Icon>
        </IconButton>

        <Toggler initialValue={false}>
          {({ value, setValue }) => (
            <>
              <IndexHabitAdd isOpen={value} onClose={() => setValue(false)} />
              <Fab
                color={"secondary"}
                aria-label={"Add"}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: -30,
                  left: 0,
                  right: 0,
                  margin: "0 auto"
                }}
                onClick={() => {
                  setValue(true);
                }}
              >
                <Icon>add</Icon>
              </Fab>
            </>
          )}
        </Toggler>
      </Toolbar>
    </AppBar>
  </div>
);
