package app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    @JsonIgnore
    private Booking booking;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentMethod; // CARD, UPI, NET_BANKING

    @Column(nullable = false, unique = true)
    private String transactionRef;

    @Column(nullable = false)
    @Builder.Default
    private String status = "SUCCESS"; // SUCCESS, PENDING, FAILED, REFUNDED

    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();
}
