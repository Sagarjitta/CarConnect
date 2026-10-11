package app.service;

import app.dto.AuthResponse;
import app.dto.LoginRequest;
import app.dto.RegisterRequest;
import app.dto.UserProfileUpdateRequest;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.User;
import app.repository.UserRepository;
import app.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with email '" + request.getEmail() + "' already exists");
        }

        String role = request.getRole() != null ? request.getRole().trim().toUpperCase() : "CUSTOMER";
        if (!role.equals("CAR_OWNER") && !role.equals("CUSTOMER") && !role.equals("ADMIN")) {
            role = "CUSTOMER";
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .city(request.getCity())
                .address(request.getAddress())
                .role(role)
                .status("ACTIVE")
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80")
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.fromEntity(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if ("SUSPENDED".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Your account is currently suspended. Please contact support.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .user(AuthResponse.UserDto.fromEntity(user))
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Transactional
    public User updateProfile(String email, UserProfileUpdateRequest request) {
        User user = getUserByEmail(email);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity().trim());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().trim());
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        return userRepository.save(user);
    }
}
