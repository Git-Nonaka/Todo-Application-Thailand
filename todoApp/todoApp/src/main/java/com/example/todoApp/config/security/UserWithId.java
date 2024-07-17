package com.example.todoApp.config.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserWithId extends User {
    private final int userId;

    public UserWithId(String username, String password, Collection<? extends GrantedAuthority> authorities, int userId) {
        super(username, password, authorities);
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }

}
