package de.tzr.service;

import de.tzr.config.JwtUtil;
import de.tzr.dto.AdminUserDTO;
import de.tzr.dto.LoginRequest;
import de.tzr.dto.LoginResponse;
import de.tzr.exception.ResourceNotFoundException;
import de.tzr.model.AdminUser;
import de.tzr.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username())
            .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        return new LoginResponse(token, refreshToken, jwtUtil.getExpirationMs(),
            new AdminUserDTO(user.getId(), user.getUsername(), user.getDisplayName(), user.getRole().name()));
    }

    public LoginResponse refresh(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new ResourceNotFoundException("Invalid refresh token");
        }
        String username = jwtUtil.getUsernameFromToken(refreshToken);
        AdminUser user = adminUserRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newToken = jwtUtil.generateToken(username);
        String newRefreshToken = jwtUtil.generateRefreshToken(username);

        return new LoginResponse(newToken, newRefreshToken, jwtUtil.getExpirationMs(),
            new AdminUserDTO(user.getId(), user.getUsername(), user.getDisplayName(), user.getRole().name()));
    }

    public AdminUserDTO getCurrentUser(String username) {
        AdminUser user = adminUserRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new AdminUserDTO(user.getId(), user.getUsername(), user.getDisplayName(), user.getRole().name());
    }
}
