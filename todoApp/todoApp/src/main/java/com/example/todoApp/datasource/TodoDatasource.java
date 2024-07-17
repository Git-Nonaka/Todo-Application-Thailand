package com.example.todoApp.datasource;

import com.example.todoApp.model.TodoModel;
import com.example.todoApp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@Repository
public class TodoDatasource implements TodoRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<TodoModel> selectAll(int userId) {
        String sql = "SELECT * FROM todo " +
                     "WHERE user_id = ?";
        List<Map<String, Object>> records = jdbcTemplate.queryForList(sql, userId);
        return records.stream()
                .map(record -> toModel(record))
                .collect(toList());
    }

    @Override
    public TodoModel selectById(int id) {
        String sql = "SELECT * FROM todo " +
                     "WHERE id = ?";
        Map<String, Object> record = jdbcTemplate.queryForMap(sql, id);
        return toModel(record);
    }

    @Override
    public void insertTodo(TodoModel todo) {
        String sql = "INSERT INTO todo(user_id, content, due_date, color) " +
                     "VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(
                sql,
                todo.getUserId(),
                todo.getContent(),
                todo.getDueDate(),
                todo.getColor()
        );
    }

    @Override
    public void updateTodo(TodoModel todo) {
        String sql = "UPDATE todo " +
                     "SET content = ?, due_date = ?, color = ?, is_checked = ?, position_x = ?, position_y = ? " +
                     "WHERE id = ?";
        jdbcTemplate.update(
                sql,
                todo.getContent(),
                todo.getDueDate(),
                todo.getColor(),
                todo.isChecked(),
                todo.getPositionX(),
                todo.getPositionY(),
                todo.getId()
        );
    }

    @Override
    public void deleteTodo(int id) {
        String sql = "DELETE FROM todo " +
                     "WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private TodoModel toModel(Map<String, Object> record) {
        return new TodoModel(
                (int) record.get("id"),
                (int) record.get("user_id"),
                (String) record.get("content"),
                ((Date) record.get("due_date")).toLocalDate(),
                (String) record.get("color"),
                (boolean) record.get("is_checked"),
                (Double) record.get("position_x"),
                (Double) record.get("position_y")
        );
    }
}
