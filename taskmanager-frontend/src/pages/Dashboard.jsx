import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Play, AlertCircle, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';
import TaskService from '../services/TaskService';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

/**
 * Dashboard Component
 * The central coordinator for our Task Management System.
 * Handles state orchestration, statistics aggregation, themes, API integration, and notification toasts.
 */
const Dashboard = () => {
  // 1. Core State Hooks
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  
  // Theme state: default is dark mode
  const [theme, setTheme] = useState('dark');
  
  // Toasts state: array of active alert banners
  const [toasts, setToasts] = useState([]);

  // 2. Fetch Tasks on Initial Mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks from Spring Boot backend REST API
  const fetchTasks = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await TaskService.getAllTasks();
      // Ensure the response data is an array
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching tasks from backend:', err);
      setApiError('Unable to connect to the backend server. Please verify the API is online.');
      triggerToast('Backend connection error!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Central CRUD Orchestration Methods
  
  // A. Trigger Toast Notification Banners
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    
    // Automatically dismiss toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // B. Handle Successful Form Operations (Create & Update)
  const handleSaveSuccess = (message, savedTask) => {
    triggerToast(message, 'success');
    setTaskToEdit(null); // Close edit drawer/state
    fetchTasks(); // Reload task board dynamically
  };

  // C. Handle Quick Status Changes (Inline updates)
  const handleStatusChange = async (taskId, nextStatus, originalTask) => {
    try {
      const updatedPayload = {
        ...originalTask,
        status: nextStatus
      };
      await TaskService.updateTask(taskId, updatedPayload);
      triggerToast(`Task updated to "${nextStatus}"`, 'success');
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      triggerToast('Failed to change task status.', 'error');
    }
  };

  // D. Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await TaskService.deleteTask(taskId);
      triggerToast('Task deleted successfully', 'success');
      // If we are currently editing the deleted task, cancel edit mode
      if (taskToEdit && taskToEdit.id === taskId) {
        setTaskToEdit(null);
      }
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      triggerToast('Failed to delete task.', 'error');
    }
  };

  // E. Handle Edit Trigger Selection
  const handleEditSelect = (task) => {
    setTaskToEdit(task);
    // Smoothly scroll to the form panel on mobile displays
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // F. Toggle Global Light/Dark Theme Mode
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    triggerToast(`Switched to ${newTheme} mode!`, 'success');
  };

  // 4. Live Statistics Aggregation
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const progressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="app-logo" onClick={fetchTasks}>
            <Sparkles size={24} style={{ color: 'var(--secondary-accent)' }} />
            <span>TaskFlow</span>
            <span style={{ fontSize: '0.8rem', paddingLeft: '0.25rem', opacity: '0.7', color: 'var(--text-secondary)' }}>Studio</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Refresh Board Button */}
            <button
              className="theme-toggle-btn"
              title="Refresh Task Board"
              onClick={fetchTasks}
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {/* Premium Theme Switcher */}
            <button
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Workspace */}
      <main className="main-content">
        
        {/* Quick Stats Grid - Glow cards aggregation */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon"><ClipboardList size={22} /></span>
            <div className="stat-info">
              <span className="stat-value">{totalTasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <span className="stat-icon"><AlertCircle size={22} /></span>
            <div className="stat-info">
              <span className="stat-value">{pendingTasks}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>

          <div className="stat-card stat-progress">
            <span className="stat-icon"><Play size={22} /></span>
            <div className="stat-info">
              <span className="stat-value">{progressTasks}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="stat-card stat-completed">
            <span className="stat-icon"><CheckCircle2 size={22} /></span>
            <div className="stat-info">
              <span className="stat-value">{completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </section>

        {/* Global Connection / Backend Error Notification bar */}
        {apiError && (
          <div style={{
            background: 'var(--priority-high-bg)',
            border: '2px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--card-shadow)',
            animation: 'fadeIn 0.4s ease-out'
          }}>
            <AlertCircle size={24} style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: '700', marginBottom: '0.15rem' }}>Backend Offline</h4>
              <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>{apiError}</p>
            </div>
          </div>
        )}

        {/* Grid Workspace Dashboard split into:
            Left: Dynamic Creator Form
            Right: Interactive List Panel */}
        <div className="dashboard-grid">
          
          {/* Section 1: Task Form panel (Sticky layout) */}
          <section>
            <TaskForm
              taskToEdit={taskToEdit}
              onSaveSuccess={handleSaveSuccess}
              onCancel={() => setTaskToEdit(null)}
            />
          </section>

          {/* Section 2: Task List Board */}
          <section style={{ minWidth: 0 }}>
            {isLoading ? (
              /* Sleek Glow Loading state */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '6rem 0' }}>
                <span className="stat-icon" style={{ animation: 'spin 2s linear infinite', width: '60px', height: '60px', borderRadius: '50%' }}>
                  <RefreshCw size={26} />
                </span>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing Task Board...</p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={handleEditSelect}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </section>
        </div>
      </main>

      {/* Floating Notification Toasts Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} style={{ color: 'var(--priority-high)' }} />
            ) : (
              <CheckCircle2 size={18} style={{ color: 'var(--priority-low)' }} />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Modern CSS Injectable spin animation keyframe */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
