package de.tzr.controller;

import de.tzr.dto.CategoryCreateDTO;
import de.tzr.dto.CategoryDTO;
import de.tzr.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> create(@Valid @RequestBody CategoryCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(dto));
    }

    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id, @Valid @RequestBody CategoryCreateDTO dto) {
        return categoryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<Long> orderedIds) {
        categoryService.reorder(orderedIds);
        return ResponseEntity.ok().build();
    }
}
