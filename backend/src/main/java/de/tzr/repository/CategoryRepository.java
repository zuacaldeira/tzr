package de.tzr.repository;

import de.tzr.model.Category;
import de.tzr.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Category> findAllByOrderBySortOrderAsc();
    List<Category> findByType(CategoryType type);
}
