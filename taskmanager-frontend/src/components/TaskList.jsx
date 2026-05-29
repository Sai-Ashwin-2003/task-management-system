import React, { useState } from 'react';
import { Edit3, Trash2, Search, ClipboardList, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default'); // Default (by ID/arrival), Title, Priority
  const priorityWeights = { High: 3, Medium: 2, Low: 1 };
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;
    const title = task.title || '';
    const description = task.description || '';
    const status = task.status || 'Pending';
    const priority = task.priority || 'Low';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const titleA = a.title || '';
    const titleB = b.title || '';
    const priorityA = a.priority || 'Low';
    const priorityB = b.priority || 'Low';
    const statusA = a.status || 'Pending';
    const statusB = b.status || 'Pending';
    if (sortBy === 'Title') {
      return titleA.localeCompare(titleB);
    }
    if (sortBy === 'Priority') {
      return (priorityWeights[priorityB] || 0) - (priorityWeights[priorityA] || 0);
    }
    if (sortBy === 'Status') {
      return statusA.localeCompare(statusB);
    }
    return 0; // Maintain default API sorting (usually by ID)
  });
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-priority-high';
      case 'Medium': return 'badge-priority-medium';
      case 'Low': return 'badge-priority-low';
      default: return 'badge-priority-low';
    }
  };
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-status-completed';
      case 'In Progress': return 'badge-status-inprogress';
      case 'Pending': return 'badge-status-pending';
      default: return 'badge-status-pending';
    }
  };
  return (
    <div className="task-list-panel">
      {}
      <div className="actions-bar">
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: '700', marginBottom: '0.25rem' }}>
          All Task Board ({sortedTasks.length})
        </h3>
        <div className="search-filter-row">
          {}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {}
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          {}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Default">Sort By: Default</option>
            <option value="Title">Sort By: Title</option>
            <option value="Priority">Sort By: Priority (High to Low)</option>
            <option value="Status">Sort By: Status</option>
          </select>
        </div>
      </div>
      {}
      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList className="empty-icon" size={48} />
          <p className="empty-title">No Tasks Found</p>
          <p style={{ fontSize: '0.9rem', opacity: '0.8' }}>
            Try adjusting your search queries or add a new task to get started!
          </p>
        </div>
      ) : (
        <div className="task-list-container">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status === 'Completed' ? 'task-completed' : ''}`}
            >
              {}
              <div className="task-card-header">
                <div>
                  <h4 className="task-title">{task.title}</h4>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>
                {}
                <div className="badges-row">
                  <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              {}
              <div className="task-card-footer">
                {}
                <div className="quick-status-control">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Status:
                  </span>
                  <select
                    className="status-select-btn"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value, task)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                {}
                <div className="card-actions-buttons">
                  {}
                  <button
                    className="icon-btn icon-btn-edit"
                    title="Edit Task Details"
                    onClick={() => onEdit(task)}
                  >
                    <Edit3 size={16} />
                  </button>
                  {}
                  <button
                    className="icon-btn icon-btn-delete"
                    title="Delete Task"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
                        onDelete(task.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TaskList;

