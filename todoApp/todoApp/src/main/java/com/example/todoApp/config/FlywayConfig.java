package com.example.todoApp.config;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {
    @Autowired
    DataSource dataSource;

    @Bean(name = "flyway", initMethod = "migrate")
    @FlywayDataSource
    public Flyway flyway() {
        System.out.println("flyway is running");
        Flyway flyway = Flyway
                .configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .load();
        flyway.migrate();
        return flyway;
    }
}
