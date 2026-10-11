package app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String phone;

    private String address;

    private String city;

    @Column(nullable = false)
    private String role; // ROLE_CUSTOMER, ROLE_CAR_OWNER, ROLE_ADMIN

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED

    private String avatarUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
