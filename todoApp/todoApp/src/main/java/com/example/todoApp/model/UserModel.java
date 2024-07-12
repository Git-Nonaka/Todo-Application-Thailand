package com.example.todoApp.model;

public class UserModel {
    private int userId;
    private String username;
    private String password;

    public int getUserId() {
        return userId;
    }
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public UserModel(int userId, String username, String password) {
        this.userId = userId;
        this.username = username;
        this.password = password;
    }
}
