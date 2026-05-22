package com.tanjer.taskmanager.service;

import com.tanjer.taskmanager.entity.Task;
import com.tanjer.taskmanager.exception.ResourceNotFoundException;
import com.tanjer.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task existingTask = getTaskById(id);
        
        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());
        existingTask.setStatus(taskDetails.getStatus());
        existingTask.setPriority(taskDetails.getPriority());
        
        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id) {
        // Ensure the task exists before deleting; will throw exception if not found
        Task existingTask = getTaskById(id);
        taskRepository.delete(existingTask);
    }
}
