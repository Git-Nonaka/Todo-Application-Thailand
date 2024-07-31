package com.example.todoApp.service;

import com.example.todoApp.model.UserModel;
import com.example.todoApp.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.stereotype.Service;

//setting for register user and set password
@Service
public class UserService {
    private final UserRepository repository;

    public void registerUser(UserModel user) {
        user.setPassword(PasswordEncoderFactories.createDelegatingPasswordEncoder().encode(user.getPassword()));
        repository.registerUser(user);
    }

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
