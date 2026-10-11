package app.controller;

import app.model.Booking;
import app.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAnyRole('CAR_OWNER', 'ADMIN')")
@Tag(name = "Car Owner Portal", description = "Endpoints for car owners to manage incoming rental requests")
public class OwnerBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get all incoming rental requests for the owner's cars")
    public ResponseEntity<List<Booking>> getOwnerBookings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getOwnerBookings(email));
    }

    @PatchMapping("/{id}/accept")
    @Operation(summary = "Accept an incoming booking request")
    public ResponseEntity<Booking> acceptBooking(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.acceptBooking(id, email, isAdmin));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject an incoming booking request")
    public ResponseEntity<Booking> rejectBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, email, isAdmin, reason));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark a completed rental trip")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.completeBooking(id, email, isAdmin));
    }
}
