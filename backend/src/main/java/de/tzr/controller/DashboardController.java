package de.tzr.controller;

import de.tzr.model.ArticleStatus;
import de.tzr.repository.ArticleRepository;
import de.tzr.repository.AuthorRepository;
import de.tzr.repository.CategoryRepository;
import de.tzr.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final NewsletterSubscriberRepository subscriberRepository;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return Map.of(
            "totalArticles", articleRepository.count(),
            "publishedArticles", articleRepository.countByStatus(ArticleStatus.PUBLISHED),
            "draftArticles", articleRepository.countByStatus(ArticleStatus.DRAFT),
            "archivedArticles", articleRepository.countByStatus(ArticleStatus.ARCHIVED),
            "categories", categoryRepository.count(),
            "authors", authorRepository.count(),
            "subscribers", subscriberRepository.count()
        );
    }
}
