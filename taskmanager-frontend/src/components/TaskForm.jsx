import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, XCircle } from 'lucide-react';
import TaskService from '../services/TaskService';
const TaskForm = ({ taskToEdit, onSaveSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending'); // Default status
  const [priority, setPriority] = useState('Low'); // Default priority
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Low');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'Pending');
      setPriority(taskToEdit.priority || 'Low');
      setError('');
    } else {
      resetForm();
    }
  }, [taskToEdit]);
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setPriority('Low');
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority
    };
    setIsLoading(true);
    setError('');
    try {
      if (taskToEdit) {
        const response = await TaskService.updateTask(taskToEdit.id, taskPayload);
        onSaveSuccess('Task updated successfully!', response.data);
      } else {
        const response = await TaskService.createTask(taskPayload);
        onSaveSuccess('Task created successfully!', response.data);
        resetForm();
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="glass-card form-panel">
      <div className="form-header">
        <span className="stat-icon" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
          {taskToEdit ? <Save size={18} /> : <PlusCircle size={18} />}
        </span>
        <h3 className="form-title">
          {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            background: 'var(--priority-high-bg)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">Task Title *</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Design Landing Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            maxLength={100}
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">Description</label>
          <textarea
            id="task-description"
            className="form-textarea"
            placeholder="Describe what needs to be done..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            maxLength={500}
          />
        </div>
        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">Priority Level</label>
          <select
            id="task-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isLoading}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">Current Status</label>
          <select
            id="task-status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flexGrow: 1 }}
            disabled={isLoading}
          >
            <Save size={18} />
            {isLoading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
          {(taskToEdit || onCancel) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                resetForm();
                if (onCancel) onCancel();
              }}
              disabled={isLoading}
            >
              <XCircle size={18} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default TaskForm;

