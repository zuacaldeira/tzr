package de.tzr.dto;

public record CategoryDTO(
    Long id, String name, String slug, String displayName,
    String description, String emoji, String color, String bgColor,
    String type, Integer sortOrder, Integer articleCount
) {}
