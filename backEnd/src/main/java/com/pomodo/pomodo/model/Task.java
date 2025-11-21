package com.pomodo.pomodo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private boolean completed;

    @Column(nullable = false)
    private String priority;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private String createdAt;

    private int pomodoroCount;

    @Column(name = "category_id")
    private String categoryId;

    // Default constructor
    public Task() {
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public int getPomodoroCount() {
        return pomodoroCount;
    }

    public void setPomodoroCount(int pomodoroCount) {
        this.pomodoroCount = pomodoroCount;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    // Convert to DTO
    public TaskDto toDto() {
        TaskDto dto = new TaskDto();
        dto.setId(this.id);
        dto.setTitle(this.title);
        dto.setCompleted(this.completed);
        dto.setPriority(this.priority);
        dto.setNote(this.note);
        dto.setCreatedAt(this.createdAt);
        dto.setPomodoroCount(this.pomodoroCount);
        dto.setCategoryId(this.categoryId);
        return dto;
    }

    // Create from DTO
    public static Task fromDto(TaskDto dto) {
        Task task = new Task();
        task.setId(dto.getId());
        task.setTitle(dto.getTitle());
        task.setCompleted(dto.isCompleted());
        task.setPriority(dto.getPriority());
        task.setNote(dto.getNote());
        task.setCreatedAt(dto.getCreatedAt());
        task.setPomodoroCount(dto.getPomodoroCount());
        task.setCategoryId(dto.getCategoryId());
        return task;
    }
}