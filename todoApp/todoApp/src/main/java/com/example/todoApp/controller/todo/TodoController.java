package com.example.todoApp.controller.todo;

import com.example.todoApp.controller.todo.request.TodoRequest;
import com.example.todoApp.model.TodoModel;
import com.example.todoApp.model.ValidateResult;
import com.example.todoApp.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todo")
public class TodoController {
    private final TodoService service;

    @Autowired
    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping(value = "/{userId}", produces = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public List<TodoModel> getAll(@PathVariable Optional<Integer> userId) {
        if (!userId.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID is required.");
        }
        return service.selectAll(userId.get());
    }

    @PostMapping(produces = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody TodoRequest request) {
        ValidateResult validate = request.validate();
        if (!validate.ok()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, validate.errorMessage());
        }
        service.insertTodo(request.toModel());
    }

    @PutMapping(value = "/{id}", produces = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable int id, @RequestBody TodoRequest request) {
        ValidateResult validate = request.validate();
        if (!validate.ok()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, validate.errorMessage());
        }
        service.updateTodo(request.toModel(id));
}


    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Optional<Integer> id) {
        if (!id.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Todo ID is required.");
        }
        service.deleteTodo(id.get());
    }
}
