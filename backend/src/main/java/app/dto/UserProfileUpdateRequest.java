package app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String city;
    private String address;
    private String avatarUrl;
}
