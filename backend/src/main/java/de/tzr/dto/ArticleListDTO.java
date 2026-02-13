package de.tzr.dto;

import java.time.LocalDate;
import java.util.List;

public record ArticleListDTO(
    Long id, String title, String slug, String excerpt,
    CategoryDTO category, AuthorDTO author, List<TagDTO> tags,
    String cardEmoji, String coverImageUrl,
    String status, Boolean academic, Boolean featured,
    LocalDate publishedDate, Integer readingTimeMinutes
) {}
