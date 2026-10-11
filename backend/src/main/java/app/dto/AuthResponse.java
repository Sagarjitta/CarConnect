package app.dto;

import app.model.User;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserDto user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDto {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String phone;
        private String city;
        private String address;
        private String avatarUrl;
        private String status;

        public static UserDto fromEntity(User user) {
            return UserDto.builder()
                    .id(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .phone(user.getPhone())
                    .city(user.getCity())
                    .address(user.getAddress())
                    .avatarUrl(user.getAvatarUrl())
                    .status(user.getStatus())
                    .build();
        }
    }
}
