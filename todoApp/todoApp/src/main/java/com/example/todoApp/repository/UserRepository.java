package com.example.todoApp.repository;

import com.example.todoApp.model.UserModel;

// find by username and register user
public interface UserRepository {
    UserModel findByUsername(String username);
    void registerUser(UserModel user);
}
