package de.tzr.controller;

import de.tzr.dto.AdminUserDTO;
import de.tzr.dto.LoginRequest;
import de.tzr.dto.LoginResponse;
import de.tzr.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestBody Map<String, String> body) {
        return authService.refresh(body.get("refreshToken"));
    }

    @GetMapping("/me")
    public AdminUserDTO me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return authService.getCurrentUser(username);
    }
}
