package com.example.todoApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
@ComponentScan("com.baeldung.spring.jdbc")
public class SpringJdbcConfig {
    @Bean("dataSource")
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://192.168.56.102:3306/todo_db");
        dataSource.setUsername("todo_user");
        dataSource.setPassword("todo_password");

        return dataSource;
    }
}
