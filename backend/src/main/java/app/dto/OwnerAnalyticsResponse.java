package app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerAnalyticsResponse {
    private Double totalEarnings;
    private long totalBookings;
    private long activeListings;
    private long completedRentals;
    private long pendingRequests;
}
