package com.example.todoApp.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests()
                    .antMatchers("/").permitAll()
                    .antMatchers("/api/login").permitAll()
                    .antMatchers("/public/**").permitAll()
                    .antMatchers("/api/**").authenticated().and()
                .addFilter(new JsonAuthenticationFilter(authenticationManager()))
                .addFilterAfter(new LoginFilter(), JsonAuthenticationFilter.class)
                .cors().configurationSource(corsConfigurationSource()).and()
                .csrf().disable();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedMethod(CorsConfiguration.ALL);
        corsConfiguration.addAllowedHeader(CorsConfiguration.ALL);
        corsConfiguration.addExposedHeader("X-AUTH-TOKEN");
        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("http://127.0.0.1:*", "http://localhost:*"));
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource corsSource = new UrlBasedCorsConfigurationSource();
        corsSource.registerCorsConfiguration("/**", corsConfiguration);
        return corsSource;
    }
}

