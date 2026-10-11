package app.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStats {
    private long totalUsers;
    private long totalCustomers;
    private long totalOwners;
    private long totalCars;
    private long activeCars;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long completedBookings;
    private Double totalRevenue;
}
