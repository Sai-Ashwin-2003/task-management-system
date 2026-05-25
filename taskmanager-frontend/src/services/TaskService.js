import axios from 'axios';

// Base URL for the Spring Boot backend API
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tasks` : "https://taskmanager-backend-wct1.onrender.com/tasks";

/**
 * TaskService handles all REST API calls using Axios.
 * This is designed to be clean, modular, and easy to explain in an interview.
 */
const TaskService = {
  
  // 1. Retrieve all tasks from the database
  getAllTasks: () => {
    return axios.get(API_BASE_URL);
  },

  // 2. Retrieve a specific task by its ID
  getTaskById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  // 3. Create a new task in the database
  createTask: (task) => {
    return axios.post(API_BASE_URL, task);
  },

  // 4. Update an existing task by its ID
  updateTask: (id, taskDetails) => {
    return axios.put(`${API_BASE_URL}/${id}`, taskDetails);
  },

  // 5. Delete a specific task from the database by ID
  deleteTask: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};

export default TaskService;
