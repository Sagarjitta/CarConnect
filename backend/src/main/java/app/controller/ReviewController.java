package app.controller;

import app.dto.ReviewRequest;
import app.model.Review;
import app.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Endpoints for car reviews, ratings, and customer feedback")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Submit a rating and review for a rented car")
    public ResponseEntity<Review> addReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Review review = reviewService.addReview(request, email);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/car/{carId}")
    @Operation(summary = "Get all customer reviews and average rating summary for a car")
    public ResponseEntity<Map<String, Object>> getCarReviews(@PathVariable Long carId) {
        List<Review> reviews = reviewService.getCarReviews(carId);
        Map<String, Object> summary = reviewService.getCarRatingSummary(carId);

        Map<String, Object> response = new HashMap<>();
        response.put("reviews", reviews);
        response.put("summary", summary);

        return ResponseEntity.ok(response);
    }
}
