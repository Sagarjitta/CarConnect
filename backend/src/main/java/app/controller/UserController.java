package app.controller;

import app.dto.AuthResponse;
import app.dto.UserProfileUpdateRequest;
import app.model.User;
import app.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "Endpoints for user profile management")
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user profile")
    public ResponseEntity<AuthResponse.UserDto> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = authService.getUserByEmail(email);
        return ResponseEntity.ok(AuthResponse.UserDto.fromEntity(user));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile information")
    public ResponseEntity<AuthResponse.UserDto> updateProfile(
            @RequestBody UserProfileUpdateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        User updated = authService.updateProfile(email, request);
        return ResponseEntity.ok(AuthResponse.UserDto.fromEntity(updated));
    }
}
