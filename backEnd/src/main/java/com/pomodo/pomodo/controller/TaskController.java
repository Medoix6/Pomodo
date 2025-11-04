package com.pomodo.pomodo.controller;

import com.pomodo.pomodo.model.Task;
import com.pomodo.pomodo.model.TaskDto;
import com.pomodo.pomodo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<TaskDto> list() {
        return taskRepository.findAll()
                .stream()
                .map(Task::toDto)
                .sorted(Comparator.comparing(TaskDto::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> get(@PathVariable String id) {
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok(task.toDto()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody TaskDto dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }
        if (dto.getCreatedAt() == null)
            dto.setCreatedAt(new Date().toString());

        Task task = Task.fromDto(dto);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask.toDto());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> update(@PathVariable String id, @RequestBody TaskDto updates) {
        return taskRepository.findById(id)
                .map(existing -> {
                    // apply updates
                    if (updates.getTitle() != null)
                        existing.setTitle(updates.getTitle());
                    existing.setCompleted(updates.isCompleted());
                    if (updates.getPriority() != null)
                        existing.setPriority(updates.getPriority());
                    if (updates.getNote() != null)
                        existing.setNote(updates.getNote());
                    existing.setPomodoroCount(updates.getPomodoroCount());
                    if (updates.getCategoryId() != null)
                        existing.setCategoryId(updates.getCategoryId());

                    Task savedTask = taskRepository.save(existing);
                    return ResponseEntity.ok(savedTask.toDto());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public List<TaskDto> getTasksByCategory(@PathVariable String categoryId) {
        return taskRepository.findByCategoryId(categoryId)
                .stream()
                .map(Task::toDto)
                .collect(Collectors.toList());
    }
}
