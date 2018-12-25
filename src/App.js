import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { compose, withState } from "recompose";

const HABITS = [
  {
    name: "Drinking water"
  },
  {
    name: "Using Pomodoro Technique"
  },
  {
    name: "Writing to Journal"
  },
  {
    name: "Procrastinating Less"
  },
  {
    name: "Getting up after waking up"
  },
  {
    name: "Eating Good"
  },
  {
    name: "Do not cross your legs"
  }
];

const FEELINGS = [`🥳`, `😁`, `😐`, `😢`, `🙁`];

const Feelings = ({ selected = [], onChange }) => (
  <span
    aria-label={"feelings"}
    role={"img"}
    style={{
      display: "block",
      fontSize: "28px"
    }}
  >
    {FEELINGS.map(icon => (
      <span
        style={{
          cursor: "pointer",
          opacity: selected.includes(icon) ? "1" : "0.5",
          padding: "0px 4px"
        }}
        onClick={() => {
          onChange([...selected, icon]);
        }}
        key={icon}
      >
        {icon}
      </span>
    ))}
  </span>
);

const List = compose(withState("feelings", "setFeelings", {}))(
  ({ feelings, setFeelings }) => (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "black",
            minHeight: "100vh"
          }}
        >
          <div
            style={{
              height: "80px",
              textAlign: "center"
            }}
          >
            {Object.keys(feelings).length === 0 &&
            feelings.constructor === Object ? (
              <img src={logo} className="App-logo" alt="logo" />
            ) : (
              <button
                onClick={() => {
                  setFeelings({});
                  window.alert("Success!");
                }}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  border: "2px solid red",
                  color: "white",
                  fontSize: "20px",
                  backgroundColor: "unset",
                  borderRadius: "4px",
                  padding: "12px"
                }}
              >
                Submit
              </button>
            )}
          </div>
          {HABITS.map(habit => (
            <div
              key={habit.name}
              style={{
                textAlign: "center",
                border: "1px solid grey",
                fontSize: "32px",
                padding: "20px 20px"
              }}
            >
              {habit.name}
              <Feelings
                selected={feelings[habit.name]}
                onChange={changes => {
                  setFeelings({
                    ...feelings,
                    [habit.name]: changes
                  });
                }}
              />
            </div>
          ))}
        </div>
      </header>
    </div>
  )
);

class App extends Component {
  render() {
    return <List />;
  }
}

export default App;
