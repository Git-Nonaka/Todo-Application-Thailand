package com.example.todoApp.service;

import com.example.todoApp.model.TodoModel;
import com.example.todoApp.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// for service
@Service
public class TodoService {
    public final TodoRepository repository;

    public List<TodoModel> selectAll(int userId) {
        return repository.selectAll(userId);
    }

    public TodoModel selectById(int id) {
        return repository.selectById(id);
    }

    public void insertTodo(TodoModel todo) {
        repository.insertTodo(todo);
    }

    public void updateTodo(TodoModel todo) {
        repository.updateTodo(todo);
    }

    public void deleteTodo(int id) {
        repository.deleteTodo(id);
    }

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }
}
