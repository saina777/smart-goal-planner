import React from "react";
import "./App.css";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import DepositForm from "./DepositForm";
import Overview from "./Overview";

function App() {
  return (
    <div className="App">
      <h1>Smart Goal Planner</h1>
      <GoalForm />
      <GoalList />
      <DepositForm />
      <Overview />
    </div>
  );
}

export default App;
