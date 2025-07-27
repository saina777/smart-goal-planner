import React from "react";
import GoalForm from "./GoalForm";
import GoalList from "./GoalList";
import DepositForm from "./DepositForm";
import Overview from "./Overview";

export default function SmartGoalPlanner() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Smart Goal Planner</h1>
      <GoalForm />
      <GoalList />
      <DepositForm />
      <Overview />
    </div>
  );
}
