package com.example.todoApp.controller.user;

import com.example.todoApp.controller.user.request.UserRequest;
import com.example.todoApp.model.UserModel;
import com.example.todoApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService service;

    @PostMapping(value = "/register", produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerUser(@RequestBody UserRequest request) {
        service.registerUser(request.toModel());
    }

    @Autowired
    public UserController(UserService service) {
        this.service = service;
    }
}
