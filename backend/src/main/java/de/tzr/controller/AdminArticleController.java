package de.tzr.controller;

import de.tzr.dto.*;
import de.tzr.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/articles")
@RequiredArgsConstructor
public class AdminArticleController {

    private final ArticleService articleService;

    @GetMapping
    public PageResponse<ArticleListDTO> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] parts = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(dir, parts[0]));
        return articleService.getAllAdmin(pageable);
    }

    @GetMapping("/{id}")
    public ArticleDTO getById(@PathVariable Long id) {
        return articleService.getByIdAdmin(id);
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> create(@Valid @RequestBody ArticleCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(dto));
    }

    @PutMapping("/{id}")
    public ArticleDTO update(@PathVariable Long id, @Valid @RequestBody ArticleCreateDTO dto) {
        return articleService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean hard) {
        articleService.delete(id, hard);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable Long id, @RequestBody StatusChangeRequest request) {
        articleService.changeStatus(id, request.status());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<Void> toggleFeatured(@PathVariable Long id) {
        articleService.toggleFeatured(id);
        return ResponseEntity.ok().build();
    }
}
