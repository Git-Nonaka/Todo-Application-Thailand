package com.example.todoApp.repository;

import com.example.todoApp.model.UserModel;

public interface UserRepository {
    UserModel findByUsername(String username);
    void registerUser(UserModel user);
}
