import React, { useState } from 'react';

const categories = [
  'Travel',
  'Emergency',
  'Electronics',
  'Real Estate',
  'Vehicle',
  'Education',
  'Shopping',
  'Retirement',
  'Home',
  'Health',
  'Entertainment',
  'Business',
  'Other'
];

function GoalForm({ onAddGoal, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    category: 'Travel',
    deadline: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const goalData = {
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        category: formData.category,
        deadline: formData.deadline
      };

      await onAddGoal(goalData);
      
      // Reset form
      setFormData({
        name: '',
        targetAmount: '',
        category: 'Travel',
        deadline: ''
      });
      
      // Show success message and redirect
      alert('Goal created successfully! 🎉');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div>
      <h2 style={{ marginBottom: '25px', color: '#333' }}>Create New Goal</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Goal Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Vacation to Hawaii"
            disabled={isSubmitting}
            style={errors.name ? { borderColor: '#ff6b6b' } : {}}
          />
          {errors.name && (
            <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>
              {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount ($) *</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            disabled={isSubmitting}
            style={errors.targetAmount ? { borderColor: '#ff6b6b' } : {}}
          />
          {errors.targetAmount && (
            <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>
              {errors.targetAmount}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Target Date *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={getMinDate()}
            disabled={isSubmitting}
            style={errors.deadline ? { borderColor: '#ff6b6b' } : {}}
          />
          {errors.deadline && (
            <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '5px' }}>
              {errors.deadline}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="submit"
            className="btn"
            disabled={isSubmitting}
            style={isSubmitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          >
            {isSubmitting ? '⏳ Creating...' : '🎯 Create Goal'}
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#333' }}>💡 Tips for Success:</h4>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Make your goals specific and measurable</li>
          <li>Set realistic deadlines to stay motivated</li>
          <li>Break large goals into smaller milestones</li>
          <li>Review and update your progress regularly</li>
        </ul>
      </div>
    </div>
  );
}

export default GoalForm;