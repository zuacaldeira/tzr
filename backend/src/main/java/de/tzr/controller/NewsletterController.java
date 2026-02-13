package de.tzr.controller;

import de.tzr.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-Mail-Adresse ist erforderlich."));
        }
        String message = newsletterService.subscribe(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }
}
