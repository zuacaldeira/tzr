package de.tzr.dto;

public record AuthorDTO(
    Long id, String name, String slug, String bio,
    String email, String avatarUrl, Integer articleCount
) {}
