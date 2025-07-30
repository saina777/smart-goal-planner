import React, { useState } from 'react';
import GoalCard from './GoalCard';

function GoalList({ goals, onDeleteGoal, onUpdateAmount }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  // Get unique categories
  const categories = ['All', ...new Set(goals.map(goal => goal.category))];

  // Filter and sort goals
  const filteredAndSortedGoals = goals
    .filter(goal => filterCategory === 'All' || goal.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'targetAmount':
          return b.targetAmount - a.targetAmount;
        case 'progress':
          const progressA = (a.savedAmount / a.targetAmount) * 100;
          const progressB = (b.savedAmount / b.targetAmount) * 100;
          return progressB - progressA;
        case 'deadline':
        default:
          return new Date(a.deadline) - new Date(b.deadline);
      }
    });

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return { total, completed, totalTarget, totalSaved, overallProgress };
  };

  const stats = getGoalStats();

  if (goals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
        <h3 style={{ marginBottom: '10px', color: '#666' }}>No Goals Yet</h3>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Start your journey by creating your first financial goal!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '25px', color: '#333' }}>My Goals ({goals.length})</h2>
      
      {/* Stats Overview */}
      <div className="goal-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${stats.totalSaved.toLocaleString()}</div>
          <div className="stat-label">Total Saved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.overallProgress.toFixed(1)}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '25px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: '600', color: '#555' }}>
            Filter by Category:
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category} {category !== 'All' && `(${goals.filter(g => g.category === category).length})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ marginRight: '10px', fontWeight: '600', color: '#555' }}>
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="deadline">Deadline</option>
            <option value="name">Name</option>
            <option value="targetAmount">Target Amount</option>
            <option value="progress">Progress</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="goals-grid">
        {filteredAndSortedGoals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onDelete={onDeleteGoal}
            onUpdateAmount={onUpdateAmount}
          />
        ))}
      </div>

      {filteredAndSortedGoals.length === 0 && filterCategory !== 'All' && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🔍</div>
          <h3 style={{ marginBottom: '10px', color: '#666' }}>No Goals Found</h3>
          <p style={{ color: '#999' }}>
            No goals match the selected category: <strong>{filterCategory}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default GoalList;