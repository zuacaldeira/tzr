package de.tzr.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    private String displayName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AdminRole role = AdminRole.EDITOR;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
