package app.service;

import app.dto.PaymentProcessRequest;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Booking;
import app.model.Payment;
import app.model.User;
import app.repository.BookingRepository;
import app.repository.PaymentRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "bookingId", bookingId));
    }

    @Transactional
    public Payment processPayment(PaymentProcessRequest request, String customerEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", request.getBookingId()));

        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", customerEmail));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You can only pay for your own bookings");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus()) || "REJECTED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot make payment for a " + booking.getStatus() + " booking");
        }

        Optional<Payment> existingPaymentOpt = paymentRepository.findByBookingId(booking.getId());
        if (existingPaymentOpt.isPresent() && "SUCCESS".equalsIgnoreCase(existingPaymentOpt.get().getStatus())) {
            throw new BadRequestException("Payment for this booking has already been processed successfully");
        }

        // Test decline simulation: card number ends in '0000'
        if (request.getCardNumber() != null && request.getCardNumber().replaceAll("\\s+", "").endsWith("0000")) {
            throw new BadRequestException("Payment simulation declined: Card ended in 0000 (test decline trigger). Please try another card.");
        }

        Double amount = (request.getAmount() != null && request.getAmount() > 0)
                ? request.getAmount()
                : booking.getTotalPrice();

        String txnRef = "TXN-CC-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        Payment payment = existingPaymentOpt.orElseGet(() -> Payment.builder()
                .booking(booking)
                .build());

        payment.setAmount(amount);
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD");
        payment.setTransactionRef(txnRef);
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        booking.setPayment(savedPayment);
        // If booking was still PENDING, flip to CONFIRMED
        if ("PENDING".equalsIgnoreCase(booking.getStatus())) {
            booking.setStatus("CONFIRMED");
        }
        bookingRepository.save(booking);

        return savedPayment;
    }
}
