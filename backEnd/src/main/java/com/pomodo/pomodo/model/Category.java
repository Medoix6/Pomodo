package com.pomodo.pomodo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String color;

    // Default constructor
    public Category() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    // Convert to DTO
    public CategoryDto toDto() {
        CategoryDto dto = new CategoryDto();
        dto.setId(this.id);
        dto.setTitle(this.title);
        dto.setDescription(this.description);
        dto.setColor(this.color);
        return dto;
    }

    // Create from DTO
    public static Category fromDto(CategoryDto dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setTitle(dto.getTitle());
        category.setDescription(dto.getDescription());
        category.setColor(dto.getColor());
        return category;
    }
}