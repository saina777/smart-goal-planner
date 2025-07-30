import React, { useState, useEffect } from 'react';
import GoalForm from './GoalForm';
import GoalList from './GoalList';
import Overview from './Overview';

const API_URL = 'http://localhost:3001/goals';

function App() {
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch goals from the API
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals. Please make sure the server is running.');
      // Use mock data as fallback
      setGoals([
        {
          id: "1",
          name: "Travel Fund - Japan",
          targetAmount: 5000,
          savedAmount: 3200,
          category: "Travel",
          deadline: "2025-12-31",
          createdAt: "2024-01-15"
        },
        {
          id: "2",
          name: "Emergency Fund",
          targetAmount: 10000,
          savedAmount: 7500,
          category: "Emergency",
          deadline: "2026-06-30",
          createdAt: "2023-05-01"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData) => {
    try {
      const newGoal = {
        ...goalData,
        id: Date.now().toString(),
        savedAmount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      });

      if (!response.ok) {
        throw new Error('Failed to add goal');
      }

      const addedGoal = await response.json();
      setGoals(prev => [...prev, addedGoal]);
    } catch (err) {
      console.error('Error adding goal:', err);
      // Fallback: add to local state if API fails
      const newGoal = {
        ...goalData,
        id: Date.now().toString(),
        savedAmount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGoals(prev => [...prev, newGoal]);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`${API_URL}/${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      // Fallback: remove from local state
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  const updateGoalAmount = async (goalId, newAmount) => {
    try {
      const goalToUpdate = goals.find(goal => goal.id === goalId);
      if (!goalToUpdate) return;

      const updatedGoal = {
        ...goalToUpdate,
        savedAmount: Math.min(newAmount, goalToUpdate.targetAmount)
      };

      const response = await fetch(`${API_URL}/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const updated = await response.json();
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? updated : goal
      ));
    } catch (err) {
      console.error('Error updating goal:', err);
      // Fallback: update local state
      setGoals(prev => prev.map(goal =>
        goal.id === goalId
          ? { ...goal, savedAmount: Math.min(newAmount, goal.targetAmount) }
          : goal
      ));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>🎯 Smart Goal Planner</h1>
          <p>Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Smart Goal Planner</h1>
        <p>Track your financial goals and make your dreams come true</p>
        {error && (
          <div style={{ 
            background: 'rgba(255, 107, 107, 0.1)', 
            color: '#ff6b6b', 
            padding: '10px', 
            borderRadius: '8px', 
            marginTop: '10px' 
          }}>
            {error}
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'overview' ? '' : 'btn-small'}`}
            onClick={() => setActiveTab('overview')}
            style={activeTab === 'overview' ? {} : { opacity: 0.7 }}
          >
            📊 Overview
          </button>
          <button
            className={`btn ${activeTab === 'goals' ? '' : 'btn-small'}`}
            onClick={() => setActiveTab('goals')}
            style={activeTab === 'goals' ? {} : { opacity: 0.7 }}
          >
            🎯 My Goals
          </button>
          <button
            className={`btn ${activeTab === 'add' ? '' : 'btn-small'}`}
            onClick={() => setActiveTab('add')}
            style={activeTab === 'add' ? {} : { opacity: 0.7 }}
          >
            ➕ Add Goal
          </button>
        </div>

        {activeTab === 'overview' && (
          <Overview goals={goals} />
        )}

        {activeTab === 'goals' && (
          <GoalList
            goals={goals}
            onDeleteGoal={deleteGoal}
            onUpdateAmount={updateGoalAmount}
          />
        )}

        {activeTab === 'add' && (
          <GoalForm
            onAddGoal={addGoal}
            onSuccess={() => setActiveTab('goals')}
          />
        )}
      </div>
    </div>
  );
}

export default App;