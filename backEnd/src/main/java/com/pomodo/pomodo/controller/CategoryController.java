package com.pomodo.pomodo.controller;

import com.pomodo.pomodo.model.Category;
import com.pomodo.pomodo.model.CategoryDto;
import com.pomodo.pomodo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostConstruct
    public void init() {
        if (categoryRepository.count() == 0) {
            // Create default category
            CategoryDto defaultCat = new CategoryDto();
            defaultCat.setId("default");
            defaultCat.setTitle("Uncategorized");
            defaultCat.setColor("hsl(var(--muted))");
            Category category = Category.fromDto(defaultCat);
            categoryRepository.save(category);
        }
    }

    @GetMapping
    public List<CategoryDto> list() {
        return categoryRepository.findAll()
                .stream()
                .map(Category::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> get(@PathVariable String id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(category.toDto()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CategoryDto dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }

        Category category = Category.fromDto(dto);
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory.toDto());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> update(@PathVariable String id, @RequestBody CategoryDto updates) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    if (updates.getTitle() != null)
                        existing.setTitle(updates.getTitle());
                    if (updates.getDescription() != null)
                        existing.setDescription(updates.getDescription());
                    if (updates.getColor() != null)
                        existing.setColor(updates.getColor());

                    Category savedCategory = categoryRepository.save(existing);
                    return ResponseEntity.ok(savedCategory.toDto());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if ("default".equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
