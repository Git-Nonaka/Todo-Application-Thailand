package com.example.todoApp.controller.todo.request;

import com.example.todoApp.model.Color;
import com.example.todoApp.model.TodoModel;
import com.example.todoApp.model.ValidateResult;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class TodoRequest {

    private int userId;
    private String content;
    private String dueDate;
    private String color;
    private boolean isChecked;
    private double positionX;
    private double positionY;

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setIsChecked(boolean checked) {
        isChecked = checked;
    }

    public void setPositionX(double positionX) {
        this.positionX = positionX;
    }

    public void setPositionY(double positionY) {
        this.positionY = positionY;
    }

    public ValidateResult validate() {
        if (content.equals(""))
            return ValidateResult.failed("content can't be empty.");

        if (dueDate.equals(""))
            return ValidateResult.failed("dueDate can't be empty.");

        if(LocalDate.parse(dueDate).isBefore(LocalDate.now()))
            return ValidateResult.failed("dueDate can't be in the past.");

        return ValidateResult.success();
    }

    public TodoModel toModel() {
        return toModel(0);
    }

    public TodoModel toModel(int id) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate formattedDueDate = LocalDate.parse(dueDate, formatter);
        return new TodoModel(id, userId, content, formattedDueDate, color, isChecked, positionX, positionY);
    }
}
