import React from "react";

export default function GoalCard({ goal }) {
  const percent = ((goal.saved / goal.target) * 100).toFixed(1);

  return (
    <div style={{ border: "1px solid #ccc", margin: "8px", padding: "12px" }}>
      <h3>{goal.title}</h3>
      <p>Saved: Ksh {goal.saved}</p>
      <p>Target: Ksh {goal.target}</p>
      <div style={{ background: "#eee", height: "10px", width: "100%" }}>
        <div
          style={{
            background: "green",
            height: "10px",
            width: `${percent}%`,
          }}
        />
      </div>
      <p>{percent}% achieved</p>
    </div>
  );
}

