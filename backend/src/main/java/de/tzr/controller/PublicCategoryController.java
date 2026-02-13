package de.tzr.controller;

import de.tzr.dto.CategoryDTO;
import de.tzr.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{slug}")
    public CategoryDTO getBySlug(@PathVariable String slug) {
        return categoryService.getBySlug(slug);
    }
}
