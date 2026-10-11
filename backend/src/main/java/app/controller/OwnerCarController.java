package app.controller;

import app.dto.CarRequest;
import app.dto.OwnerAnalyticsResponse;
import app.model.Car;
import app.model.User;
import app.service.AuthService;
import app.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasAnyRole('CAR_OWNER', 'ADMIN')")
@Tag(name = "Car Owner Portal", description = "Endpoints for car owners to manage vehicles and monitor earnings")
public class OwnerCarController {

    private final CarService carService;
    private final AuthService authService;

    @GetMapping("/cars")
    @Operation(summary = "Get all car listings owned by the authenticated owner")
    public ResponseEntity<List<Car>> getOwnerCars(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(carService.getOwnerCars(user.getId()));
    }

    @PostMapping("/cars")
    @Operation(summary = "Add a new car listing with specifications and photos")
    public ResponseEntity<Car> createCar(@Valid @RequestBody CarRequest request, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        Car created = carService.createCar(request, user.getId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/cars/{id}")
    @Operation(summary = "Update car details, pricing, or photos")
    public ResponseEntity<Car> updateCar(@PathVariable Long id,
                                         @Valid @RequestBody CarRequest request,
                                         Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Car updated = carService.updateCar(id, request, user.getId(), isAdmin);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/cars/{id}")
    @Operation(summary = "Delete a car listing")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        carService.deleteCar(id, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/cars/{id}/toggle-publish")
    @Operation(summary = "Publish or unpublish a car listing from public search")
    public ResponseEntity<Car> togglePublish(@PathVariable Long id, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Car updated = carService.togglePublish(id, user.getId(), isAdmin);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get car owner analytics and earnings breakdown")
    public ResponseEntity<OwnerAnalyticsResponse> getOwnerAnalytics(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(carService.getOwnerAnalytics(user.getId()));
    }
}
