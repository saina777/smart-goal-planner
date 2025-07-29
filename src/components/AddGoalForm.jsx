import React, { useState } from "react";

const API_URL = "http://localhost:3001/goals";

export default function AddGoalForm({ onGoalAdded }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGoal = {
      name,
      targetAmount: parseFloat(targetAmount),
      deadline,
      category,
      savedAmount: 0,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGoal),
    });

    if (res.ok) {
      const saved = await res.json();
      onGoalAdded(saved);
      // Clear form
      setName("");
      setTargetAmount("");
      setDeadline("");
      setCategory("");
    } else {
      alert("Failed to add goal.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.form}>
      <input
        style={formStyles.input}
        type="text"
        placeholder="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        style={formStyles.input}
        type="number"
        placeholder="Target Amount"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        required
      />
      <input
        style={formStyles.input}
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />
      <input
        style={formStyles.input}
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit" style={formStyles.button}>Add Goal</button>
    </form>
  );
}

const formStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
