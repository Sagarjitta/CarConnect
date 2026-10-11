package app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentProcessRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    private Double amount;

    private String paymentMethod; // CARD, UPI, NET_BANKING

    private String cardNumber;

    private String cardHolder;

    private String expiry;

    private String cvv;
}
