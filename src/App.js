import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

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

const Feelings = () => (
  <span
    aria-label={"feelings"}
    role={"img"}
    style={{
      opacity: "0.8",
      display: "block",
      fontSize: "16px"
    }}
  >
    🥳 😁 😐 😢 🙁
  </span>
);

class App extends Component {
  render() {
    return (
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
            <img src={logo} className="App-logo" alt="logo" />
            {HABITS.map(habit => (
              <div
                key={habit.name}
                style={{
                  height: "100px",
                  textAlign: "center",
                  border: "1px solid grey",
                  padding: "16px"
                }}
              >
                {habit.name}
                <Feelings />
              </div>
            ))}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
