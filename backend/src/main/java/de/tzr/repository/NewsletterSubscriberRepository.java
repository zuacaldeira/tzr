package de.tzr.repository;

import de.tzr.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
    boolean existsByEmail(String email);
}
