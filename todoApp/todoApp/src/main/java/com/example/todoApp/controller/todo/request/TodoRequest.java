package com.example.todoApp.controller.todo.request;

import com.example.todoApp.model.TodoModel;
import com.example.todoApp.model.ValidateResult;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TodoRequest {

    private int userId;
    private String content;
    private String dueDate;
    private String color;
    private boolean isChecked;
    private double positionX;
    private double positionY;

    // set todo request
    @JsonCreator
    public TodoRequest(
            @JsonProperty("userId") int userId,
            @JsonProperty("content") String content,
            @JsonProperty("dueDate") String dueDate,
            @JsonProperty("color") String color,
            @JsonProperty("isChecked") boolean isChecked,
            @JsonProperty("positionX") double positionX,
            @JsonProperty("positionY") double positionY) {
        this.userId = userId;
        this.content = content;
        this.dueDate = dueDate;
        this.color = color;
        this.isChecked = isChecked;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    // Getters and Setters
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

    public void setIsChecked(boolean isChecked) {
        this.isChecked = isChecked;
    }

    public void setPositionX(double positionX) {
        this.positionX = positionX;
    }

    public void setPositionY(double positionY) {
        this.positionY = positionY;
    }

    //for validate
    public ValidateResult validate() {
        if (content == null || content.isEmpty()) {
            System.out.println("Validation failed: Content can't be empty.");
            return ValidateResult.failed("Content can't be empty.");
        }
    
        if (dueDate == null || dueDate.isEmpty()) {
            System.out.println("Validation failed: Due date can't be empty.");
            return ValidateResult.failed("Due date can't be empty.");
        }
    
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate parsedDueDate = LocalDate.parse(dueDate, formatter);
            if (parsedDueDate.isBefore(LocalDate.now())) {
                System.out.println("Validation failed: Due date can't be in the past.");
                return ValidateResult.failed("Due date can't be in the past.");
            }
        } catch (DateTimeParseException e) {
            System.out.println("Validation failed: Invalid due date format.");
            return ValidateResult.failed("Invalid due date format. Please use yyyy-MM-dd.");
        }
    
        if (userId <= 0) {
            System.out.println("Validation failed: User ID must be greater than 0.");
            return ValidateResult.failed("User ID must be greater than 0.");
        }
    
        if (color == null || color.isEmpty()) {
            System.out.println("Validation failed: Color can't be empty.");
            return ValidateResult.failed("Color can't be empty.");
        }
    
        if (positionX < 0 || positionY < 0) {
            System.out.println("Validation failed: Position X and Y must be non-negative.");
            return ValidateResult.failed("Position X and Y must be non-negative.");
        }
    
        System.out.println("Validation successful.");
        return ValidateResult.success();
    }
    
    public TodoModel toModel() {
        return toModel(0);
    }

    public TodoModel toModel(int id) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate formattedDueDate = null;
        try {
            formattedDueDate = LocalDate.parse(dueDate, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Error parsing due date: " + dueDate);
            throw new IllegalArgumentException("Invalid due date format. Please use yyyy-MM-dd.");
        }
        System.out.println("Converting to TodoModel with id: " + id);
        return new TodoModel(id, userId, content, formattedDueDate, color, isChecked, positionX, positionY);
    }       
}
