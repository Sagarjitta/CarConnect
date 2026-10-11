package app.repository;

import app.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByCarIdOrderByCreatedAtDesc(Long carId);

    List<Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.car.id = :carId")
    Double getAverageRatingForCar(@Param("carId") Long carId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.car.id = :carId")
    Long getReviewCountForCar(@Param("carId") Long carId);
}
