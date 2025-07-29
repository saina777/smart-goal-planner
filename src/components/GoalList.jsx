import React from "react";
import GoalCard from "./GoalCard.jsx";

const dummyGoals = [
  { id: 1, title: "Buy a Laptop", saved: 20000, target: 60000 },
  { id: 2, title: "Vacation", saved: 15000, target: 50000 },
];

export default function GoalList() {
  return (
    <div>
      {dummyGoals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
