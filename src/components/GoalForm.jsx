import React, { useState } from "react";

export default function GoalForm() {
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Goal Added: ${goal}`);
    setGoal("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your savings goal"
        required
      />
      <button type="submit">Add Goal</button>
    </form>
  );
}
