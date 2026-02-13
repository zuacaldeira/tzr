package de.tzr.repository;

import de.tzr.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
