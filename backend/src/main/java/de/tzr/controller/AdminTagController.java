package de.tzr.controller;

import de.tzr.dto.TagDTO;
import de.tzr.dto.TagMergeRequest;
import de.tzr.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final TagService tagService;

    @GetMapping
    public List<TagDTO> getAll() {
        return tagService.getAll();
    }

    @PostMapping
    public ResponseEntity<TagDTO> create(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.create(body.get("name")));
    }

    @PutMapping("/{id}")
    public TagDTO update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return tagService.update(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tagService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/merge")
    public ResponseEntity<Void> merge(@RequestBody TagMergeRequest request) {
        tagService.merge(request.sourceId(), request.targetId());
        return ResponseEntity.ok().build();
    }
}
