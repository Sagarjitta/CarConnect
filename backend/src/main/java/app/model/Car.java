package app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"password"})
    private User owner;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(name = "manufacturing_year", nullable = false)
    private Integer year;

    @Column(name = "reg_number", nullable = false, unique = true)
    private String regNumber;

    @Column(nullable = false)
    private String carType; // Hatchback, Sedan, SUV, Luxury, Convertible, Van

    @Column(nullable = false)
    private String fuelType; // Petrol, Diesel, Electric, Hybrid

    @Column(nullable = false)
    private String transmission; // Automatic, Manual

    @Column(nullable = false)
    private Integer seats;

    @Column(nullable = false)
    private Double pricePerDay;

    @Column(nullable = false)
    private String city;

    private String locationAddress;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String features; // Comma separated: GPS, Sunroof, Bluetooth, 360 Camera, etc.

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPublished = true;

    @Builder.Default
    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<CarImage> images = new ArrayList<>();

    public void addImage(CarImage image) {
        images.add(image);
        image.setCar(this);
    }

    public void removeImage(CarImage image) {
        images.remove(image);
        image.setCar(null);
    }
}
