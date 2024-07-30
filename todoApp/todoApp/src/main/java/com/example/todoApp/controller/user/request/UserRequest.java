package com.example.todoApp.controller.user.request;

import com.example.todoApp.model.UserModel;

public class UserRequest {
    private String username;
    private String password;

    //for get username and get password
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }

    //for set username and set password
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    //model user
    public UserModel toModel() {
        return new UserModel(0, this.username, this.password);
    }
}
