package app.controller;

import app.dto.PaymentProcessRequest;
import app.model.Payment;
import app.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments", description = "Endpoints for simulated checkout and transaction receipts")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @Operation(summary = "Process simulated payment checkout for a booking")
    public ResponseEntity<Payment> processPayment(
            @Valid @RequestBody PaymentProcessRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(paymentService.processPayment(request, email));
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payment receipt for a specific booking")
    public ResponseEntity<Payment> getPaymentByBookingId(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }
}
