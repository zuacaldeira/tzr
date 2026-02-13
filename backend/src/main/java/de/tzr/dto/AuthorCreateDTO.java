package de.tzr.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthorCreateDTO(
    @NotBlank String name,
    String slug,
    String bio, String email, String avatarUrl
) {}
