package com.example.todoApp.datasource;

import com.example.todoApp.model.UserModel;
import com.example.todoApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class UserDatasource implements UserRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    // find by username for login page

    @Override
    public UserModel findByUsername(String username) {
        String sql = "SELECT * FROM user WHERE username = ?";
        Map<String, Object> record = jdbcTemplate.queryForMap(sql, username);
        return new UserModel(
                (int) record.get("id"),
                (String) record.get("username"),
                (String) record.get("password")
        );
    }

    // for register user in register page
    
    @Override
    public void registerUser(UserModel user) {
        String sql = "INSERT INTO user (username, password) VALUES (?, ?)";
        jdbcTemplate.update(sql, user.getUsername(), user.getPassword());
    }
}
