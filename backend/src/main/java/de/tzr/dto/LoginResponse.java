package de.tzr.dto;

public record LoginResponse(String token, String refreshToken, long expiresIn, AdminUserDTO user) {}
