import React, { useEffect, useState } from "react";
import AddGoalForm from "./AddGoalForm";

const API_URL = "http://localhost:3001/goals";

export default function App() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setGoals)
      .catch((err) => {
        console.error("Error fetching goals:", err);
      });
  }, []);

  const handleGoalAdded = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📈 Smart Goal Planner</h1>
        <p style={styles.subtitle}>Track your financial goals with ease</p>
      </header>

      <section style={styles.formSection}>
        <AddGoalForm onGoalAdded={handleGoalAdded} />
      </section>

      <section style={styles.goalList}>
        <h2 style={styles.goalListTitle}>Your Goals</h2>
        {goals.length === 0 ? (
          <p style={styles.emptyMessage}>No goals yet. Add one!</p>
        ) : (
          <ul style={styles.list}>
            {goals.map((goal) => (
              <li key={goal.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{goal.name}</h3>
                <p>🎯 Target: Ksh {goal.targetAmount}</p>
                <p>📅 Deadline: {goal.deadline}</p>
                <p>💰 Saved: Ksh {goal.savedAmount}</p>
                <p>🏷️ Category: {goal.category}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5rem",
    margin: "0",
    color: "#0077cc",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
  },
  formSection: {
    marginBottom: "40px",
  },
  goalList: {
    borderTop: "2px solid #ddd",
    paddingTop: "20px",
  },
  goalListTitle: {
    fontSize: "1.8rem",
    marginBottom: "15px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "12px",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    margin: "0 0 8px 0",
  },
};
