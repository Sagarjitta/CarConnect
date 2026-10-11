package app.controller;

import app.dto.BookingCreateRequest;
import app.model.Booking;
import app.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Endpoints for vehicle rental reservations and customer booking history")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Submit a rental booking request for a car")
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Booking booking = bookingService.createBooking(request, email);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get all rental bookings created by the authenticated customer")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(bookingService.getCustomerBookings(email));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific booking")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking reservation")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(bookingService.cancelBooking(id, email, isAdmin));
    }
}
