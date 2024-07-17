package com.example.todoApp.model;

import java.time.LocalDate;

public class TodoModel {
    public final int id;
    public final int userId;
    public final String content;
    public final LocalDate dueDate;
    public final String color;
    public final boolean isChecked;
    public final double positionX;
    public final double positionY;

    public int getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public String getColor() {
        return color;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public double getPositionX() {
        return positionX;
    }

    public double getPositionY() {
        return positionY;
    }

    public TodoModel(int id, int userId, String content, LocalDate dueDate, String color, boolean isChecked, double positionX, double positionY) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.dueDate = dueDate;
        this.color = color;
        this.isChecked = isChecked;
        this.positionX = positionX;
        this.positionY = positionY;
    }
}
