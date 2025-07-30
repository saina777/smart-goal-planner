import React, { useState } from 'react';
import DepositForm from './DepositForm';

function GoalCard({ goal, onDelete, onUpdateAmount }) {
  const [showDepositForm, setShowDepositForm] = useState(false);

  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  const remaining = goal.targetAmount - goal.savedAmount;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();
  const isOverdue = daysLeft < 0;
  const isUrgent = daysLeft <= 30 && daysLeft > 0;

  const getDeadlineColor = () => {
    if (isCompleted) return '#4CAF50';
    if (isOverdue) return '#ff6b6b';
    if (isUrgent) return '#ff9800';
    return '#888';
  };

  const getDeadlineText = () => {
    if (isCompleted) return '✅ Completed';
    if (isOverdue) return `⚠️ ${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return '🚨 Due today';
    if (daysLeft === 1) return '⏰ 1 day left';
    if (isUrgent) return `⏰ ${daysLeft} days left`;
    return `📅 ${daysLeft} days left`;
  };

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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${goal.name}"? This action cannot be undone.`)) {
      onDelete(goal.id);
    }
  };

  const handleDeposit = (amount) => {
    const newAmount = goal.savedAmount + amount;
    onUpdateAmount(goal.id, newAmount);
    setShowDepositForm(false);
  };

  const handleWithdraw = () => {
    const withdrawAmount = prompt('How much would you like to withdraw?', '0');
    if (withdrawAmount !== null) {
      const amount = parseFloat(withdrawAmount);
      if (amount > 0 && amount <= goal.savedAmount) {
        const newAmount = goal.savedAmount - amount;
        onUpdateAmount(goal.id, newAmount);
      } else if (amount > goal.savedAmount) {
        alert('Cannot withdraw more than the saved amount!');
      }
    }
  };

  return (
    <div className="card" style={isCompleted ? { background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9ff 100%)' } : {}}>
      <div className="goal-header">
        <h3 className="goal-name">{goal.name}</h3>
        <span className="goal-category">
          {getCategoryEmoji(goal.category)} {goal.category}
        </span>
      </div>

      <div className="goal-amount">
        <strong>${goal.savedAmount.toLocaleString()}</strong> of ${goal.targetAmount.toLocaleString()}
        {!isCompleted && (
          <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '10px' }}>
            (${remaining.toLocaleString()} remaining)
          </span>
        )}
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            background: isCompleted 
              ? 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)'
              : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        margin: '15px 0'
      }}>
        <span style={{ fontWeight: '600', color: '#333' }}>
          {progress.toFixed(1)}% Complete
        </span>
        <span style={{ color: getDeadlineColor(), fontWeight: '500' }}>
          {getDeadlineText()}
        </span>
      </div>

      <div className="goal-deadline" style={{ color: getDeadlineColor() }}>
        📅 Target Date: {formatDate(goal.deadline)}
      </div>

      {showDepositForm ? (
        <DepositForm
          goal={goal}
          onDeposit={handleDeposit}
          onCancel={() => setShowDepositForm(false)}
        />
      ) : (
        <div className="goal-actions">
          {!isCompleted && (
            <button
              className="btn btn-small"
              onClick={() => setShowDepositForm(true)}
              style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
            >
              💰 Add Money
            </button>
          )}
          
          {goal.savedAmount > 0 && (
            <button
              className="btn btn-small"
              onClick={handleWithdraw}
              style={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}
            >
              💸 Withdraw
            </button>
          )}
          
          <button
            className="btn btn-small btn-delete"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {isCompleted && (
        <div style={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: '15px',
          fontWeight: '600'
        }}>
          🎉 Congratulations! Goal Achieved! 🎉
        </div>
      )}

      <div style={{ 
        fontSize: '0.8rem', 
        color: '#999', 
        marginTop: '15px',
        textAlign: 'center'
      }}>
        Created on {formatDate(goal.createdAt)}
      </div>
    </div>
  );
}

export default GoalCard;