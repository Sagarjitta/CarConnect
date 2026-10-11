package app.service;

import app.dto.ReviewRequest;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Car;
import app.model.Review;
import app.model.User;
import app.repository.CarRepository;
import app.repository.ReviewRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public List<Review> getCarReviews(Long carId) {
        return reviewRepository.findByCarIdOrderByCreatedAtDesc(carId);
    }

    public Map<String, Object> getCarRatingSummary(Long carId) {
        Double avg = reviewRepository.getAverageRatingForCar(carId);
        Long count = reviewRepository.getReviewCountForCar(carId);

        Map<String, Object> map = new HashMap<>();
        map.put("averageRating", Math.round((avg != null ? avg : 0.0) * 10.0) / 10.0);
        map.put("totalReviews", count != null ? count : 0L);
        return map;
    }

    @Transactional
    public Review addReview(ReviewRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", customerEmail));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car", "id", request.getCarId()));

        if (car.getOwner().getId().equals(customer.getId())) {
            throw new BadRequestException("You cannot review your own vehicle");
        }

        Review review = Review.builder()
                .car(car)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment().trim())
                .build();

        return reviewRepository.save(review);
    }
}
