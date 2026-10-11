package app.controller;

import app.model.Car;
import app.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@Tag(name = "Cars", description = "Public endpoints for exploring and searching peer-to-peer car listings")
public class CarController {

    private final CarService carService;

    @GetMapping
    @Operation(summary = "Browse and search car listings with city, type, fuel, seats, price, and date filters")
    public ResponseEntity<List<Car>> searchCars(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String carType,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) Integer minSeats,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Car> cars = carService.searchCars(city, carType, fuelType, transmission,
                minSeats, maxPrice, searchQuery, startDate, endDate);
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed specifications and photos for a specific car")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }
}
