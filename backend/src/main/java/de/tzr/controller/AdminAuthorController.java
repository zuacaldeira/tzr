package de.tzr.controller;

import de.tzr.dto.AuthorCreateDTO;
import de.tzr.dto.AuthorDTO;
import de.tzr.service.AuthorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/authors")
@RequiredArgsConstructor
public class AdminAuthorController {

    private final AuthorService authorService;

    @GetMapping
    public List<AuthorDTO> getAll() {
        return authorService.getAll();
    }

    @GetMapping("/{id}")
    public AuthorDTO getById(@PathVariable Long id) {
        return authorService.getById(id);
    }

    @PostMapping
    public ResponseEntity<AuthorDTO> create(@Valid @RequestBody AuthorCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authorService.create(dto));
    }

    @PutMapping("/{id}")
    public AuthorDTO update(@PathVariable Long id, @Valid @RequestBody AuthorCreateDTO dto) {
        return authorService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
