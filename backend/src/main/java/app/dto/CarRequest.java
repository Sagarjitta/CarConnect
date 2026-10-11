package app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Manufacturing year is required")
    @Min(value = 1990, message = "Year must be 1990 or newer")
    private Integer year;

    @NotBlank(message = "Registration number is required")
    private String regNumber;

    @NotBlank(message = "Car type is required")
    private String carType; // Hatchback, Sedan, SUV, Luxury, Convertible, Van

    @NotBlank(message = "Fuel type is required")
    private String fuelType; // Petrol, Diesel, Electric, Hybrid

    @NotBlank(message = "Transmission is required")
    private String transmission; // Automatic, Manual

    @NotNull(message = "Number of seats is required")
    @Min(value = 1, message = "Minimum 1 seat required")
    private Integer seats;

    @NotNull(message = "Price per day is required")
    @Min(value = 100, message = "Minimum price per day is ₹100")
    private Double pricePerDay;

    @NotBlank(message = "City is required")
    private String city;

    private String locationAddress;

    private String description;

    private String features; // Comma separated: GPS, Sunroof, Bluetooth, 360 Camera

    @Builder.Default
    private Boolean isPublished = true;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
}
