package de.tzr.exception;

public class SlugAlreadyExistsException extends RuntimeException {
    public SlugAlreadyExistsException(String slug) {
        super("Slug already exists: " + slug);
    }
}
