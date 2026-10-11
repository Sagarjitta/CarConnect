package app.controller;

import app.dto.AdminDashboardStats;
import app.model.Booking;
import app.model.Car;
import app.model.User;
import app.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Portal", description = "Endpoints for platform administration, user moderation, and inventory management")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level platform KPIs, volume metrics, and user counts")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all registered platform users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user status (ACTIVE or SUSPENDED)")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(adminService.updateUserStatus(id, status));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user account")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cars")
    @Operation(summary = "Get all platform car listings")
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(adminService.getAllCars());
    }

    @PatchMapping("/cars/{id}/status")
    @Operation(summary = "Update car status (ACTIVE or SUSPENDED)")
    public ResponseEntity<Car> updateCarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(adminService.updateCarStatus(id, status));
    }

    @DeleteMapping("/cars/{id}")
    @Operation(summary = "Delete car listing")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        adminService.deleteCar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings across the platform")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @PatchMapping("/bookings/{id}/status")
    @Operation(summary = "Force update booking status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(adminService.updateBookingStatus(id, status));
    }
}
