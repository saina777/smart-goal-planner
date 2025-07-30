import React from 'react';

function Overview({ goals }) {
  const getOverviewStats = () => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
    const inProgress = total - completed;
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const totalRemaining = totalTarget - totalSaved;

    return {
      total,
      completed,
      inProgress,
      totalTarget,
      totalSaved,
      totalRemaining,
      overallProgress
    };
  };

  const getCategoryBreakdown = () => {
    const categoryData = {};
    goals.forEach(goal => {
      if (!categoryData[goal.category]) {
        categoryData[goal.category] = {
          count: 0,
          totalTarget: 0,
          totalSaved: 0,
          completed: 0
        };
      }
      categoryData[goal.category].count++;
      categoryData[goal.category].totalTarget += goal.targetAmount;
      categoryData[goal.category].totalSaved += goal.savedAmount;
      if (goal.savedAmount >= goal.targetAmount) {
        categoryData[goal.category].completed++;
      }
    });

    return Object.entries(categoryData)
      .map(([category, data]) => ({
        category,
        ...data,
        progress: data.totalTarget > 0 ? (data.totalSaved / data.totalTarget) * 100 : 0
      }))
      .sort((a, b) => b.totalTarget - a.totalTarget);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return goals
      .filter(goal => goal.savedAmount < goal.targetAmount)
      .map(goal => ({
        ...goal,
        daysLeft: Math.ceil((new Date(goal.deadline) - today) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  };

  const getTopPerformers = () => {
    return goals
      .map(goal => ({
        ...goal,
        progress: (goal.savedAmount / goal.targetAmount) * 100
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  };

  const stats = getOverviewStats();
  const categoryBreakdown = getCategoryBreakdown();
  const upcomingDeadlines = getUpcomingDeadlines();
  const topPerformers = getTopPerformers();

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      Travel: '✈️',
      Emergency: '🚨',
      Electronics: '💻',
      'Real Estate': '🏠',
      Vehicle: '🚗',
      Education: '📚',
      Shopping: '🛍️',
      Retirement: '🏖️',
      Home: '🏡',
      Health: '🏥',
      Entertainment: '🎬',
      Business: '💼',
      Other: '📝'
    };
    return emojiMap[category] || '📝';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (goals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
        <h3 style={{ marginBottom: '10px', color: '#666' }}>Welcome to Your Goal Dashboard</h3>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Create your first goal to see your progress overview here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '25px', color: '#333' }}>📊 Overview Dashboard</h2>

      <div className="goal-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#4CAF50' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ff9800' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.overallProgress.toFixed(1)}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>💰 Financial Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Total Target</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              ${stats.totalTarget.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Total Saved</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
              ${stats.totalSaved.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Remaining</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>
              ${stats.totalRemaining.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div className="progress-bar" style={{ height: '25px' }}>
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(stats.overallProgress, 100)}%`,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: '600' }}>
            Overall Progress: {stats.overallProgress.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="chart-container">
          <h3 className="chart-title">📈 Goals by Category</h3>
          {categoryBreakdown.map(category => (
            <div key={category.category} style={{ marginBottom: '15px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '500' }}>
                  {getCategoryEmoji(category.category)} {category.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  ${category.totalSaved.toLocaleString()} / ${category.totalTarget.toLocaleString()}
                </span>
              </div>
              <div className="progress-bar" style={{ height: '8px' }}>
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min(category.progress, 100)}%`,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                {category.progress.toFixed(1)}% complete ({category.completed}/{category.count} goals)
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="chart-title">⏰ Upcoming Deadlines</h3>
          {upcomingDeadlines.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              🎉 All goals completed or no active deadlines!
            </div>
          ) : (
            upcomingDeadlines.map(goal => (
              <div key={goal.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px',
                margin: '8px 0',
                background: goal.daysLeft <= 0 ? '#ffebee' : goal.daysLeft <= 7 ? '#fff3e0' : '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${goal.daysLeft <= 0 ? '#f44336' : goal.daysLeft <= 7 ? '#ff9800' : '#2196f3'}`
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    {goal.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Due: {formatDate(goal.deadline)}
                  </div>
                </div>
                <div style={{ 
                  textAlign: 'right',
                  color: goal.daysLeft <= 0 ? '#f44336' : goal.daysLeft <= 7 ? '#ff9800' : '#2196f3'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {goal.daysLeft <= 0 ? `${Math.abs(goal.daysLeft)} days overdue` : 
                     goal.daysLeft === 1 ? '1 day left' : `${goal.daysLeft} days left`}
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    {((goal.savedAmount / goal.targetAmount) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chart-container">
          <h3 className="chart-title">🏆 Top Performers</h3>
          {topPerformers.map((goal, index) => (
            <div key={goal.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px',
              margin: '8px 0',
              background: index === 0 ? '#f3e5f5' : '#f8f9fa',
              borderRadius: '8px',
              borderLeft: `4px solid ${index === 0 ? '#9c27b0' : '#667eea'}`
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </span>
                  <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                    {goal.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginLeft: '28px' }}>
                  ${goal.savedAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </div>
              </div>
              <div style={{ 
                textAlign: 'right',
                color: goal.progress >= 100 ? '#4CAF50' : '#667eea'
              }}>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {goal.progress.toFixed(1)}%
                </div>
                {goal.progress >= 100 && (
                  <div style={{ fontSize: '0.8rem', color: '#4CAF50' }}>
                    ✅ Complete
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <h3 className="chart-title">📅 Goal Summary</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ 
              padding: '15px', 
              background: '#e8f5e8', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50' }}>
                {stats.completed}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#2e7d32' }}>
                Goals Completed 🎉
              </div>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: '#fff3e0', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>
                {stats.inProgress}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#f57c00' }}>
                Goals In Progress 🚀
              </div>
            </div>

            <div style={{ 
              padding: '15px', 
              background: '#e3f2fd', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2196f3' }}>
                ${(stats.totalSaved / (stats.total || 1)).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#1976d2' }}>
                Average Saved per Goal 💰
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.overallProgress > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {stats.overallProgress >= 75 ? '🎉' : stats.overallProgress >= 50 ? '🚀' : '💪'}
          </div>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>
            {stats.overallProgress >= 100 ? 'Congratulations! You\'ve achieved your goals!' :
             stats.overallProgress >= 75 ? 'You\'re almost there! Keep pushing!' :
             stats.overallProgress >= 50 ? 'Great progress! You\'re halfway there!' :
             stats.overallProgress >= 25 ? 'Good start! Keep building momentum!' :
             'Every journey begins with a single step!'}
          </div>
          <div style={{ opacity: 0.9 }}>
            You've saved ${stats.totalSaved.toLocaleString()} towards your ${stats.totalTarget.toLocaleString()} goal!
          </div>
        </div>
      )}
    </div>
  );
}

export default Overview;