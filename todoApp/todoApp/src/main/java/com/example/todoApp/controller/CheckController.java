package com.example.todoApp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/check")
public class CheckController {
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Boolean check() {
        return Boolean.TRUE;
    }
}
