package de.tzr.service;

import de.tzr.model.NewsletterSubscriber;
import de.tzr.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;

    public String subscribe(String email) {
        if (subscriberRepository.existsByEmail(email)) {
            return "Diese E-Mail-Adresse ist bereits angemeldet.";
        }
        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
            .email(email)
            .build();
        subscriberRepository.save(subscriber);
        return "Erfolgreich angemeldet!";
    }

    public long getCount() {
        return subscriberRepository.count();
    }
}
