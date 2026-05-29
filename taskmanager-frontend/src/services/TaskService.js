import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tasks` : "https://taskmanager-backend-wct1.onrender.com/tasks";
const TaskService = {
  getAllTasks: () => {
    return axios.get(API_BASE_URL);
  },
  getTaskById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },
  createTask: (task) => {
    return axios.post(API_BASE_URL, task);
  },
  updateTask: (id, taskDetails) => {
    return axios.put(`${API_BASE_URL}/${id}`, taskDetails);
  },
  deleteTask: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  }
};
export default TaskService;

