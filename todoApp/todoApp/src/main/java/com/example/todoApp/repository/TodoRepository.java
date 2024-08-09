package com.example.todoApp.repository;

import com.example.todoApp.model.TodoModel;

import java.util.List;

//for todo repository
public interface TodoRepository {
    List<TodoModel> selectAll(int userId);
    TodoModel selectById(int id);
    void insertTodo(TodoModel todo);
    void updateTodo(TodoModel todo);
    void deleteTodo(int id);
}
