package com.pomodo.pomodo.repository;

import com.pomodo.pomodo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByCategoryId(String categoryId);
}