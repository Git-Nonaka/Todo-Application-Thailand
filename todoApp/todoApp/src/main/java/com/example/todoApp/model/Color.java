package com.example.todoApp.model;

import java.util.stream.Stream;

public enum Color {
    RED,
    BLUE,
    GREEN;

    public static boolean validOf(String text) {
        return Stream.of(values())
                .map(Color::name)
                .anyMatch(text::equals);
    }
}
