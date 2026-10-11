package app.repository;

import app.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Car> findByIsPublishedTrueAndStatusOrderByCreatedAtDesc(String status);

    boolean existsByRegNumber(String regNumber);

    long countByStatus(String status);

    @Query("SELECT c FROM Car c WHERE c.isPublished = true AND c.status = 'ACTIVE' " +
           "AND (:city IS NULL OR LOWER(c.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:carType IS NULL OR LOWER(c.carType) = LOWER(:carType)) " +
           "AND (:fuelType IS NULL OR LOWER(c.fuelType) = LOWER(:fuelType)) " +
           "AND (:transmission IS NULL OR LOWER(c.transmission) = LOWER(:transmission)) " +
           "AND (:minSeats IS NULL OR c.seats >= :minSeats) " +
           "AND (:maxPrice IS NULL OR c.pricePerDay <= :maxPrice) " +
           "AND (:searchQuery IS NULL OR (" +
           "    LOWER(c.brand) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
           "    LOWER(c.model) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR " +
           "    LOWER(c.city) LIKE LOWER(CONCAT('%', :searchQuery, '%'))" +
           ")) ORDER BY c.createdAt DESC")
    List<Car> searchAvailableCars(
            @Param("city") String city,
            @Param("carType") String carType,
            @Param("fuelType") String fuelType,
            @Param("transmission") String transmission,
            @Param("minSeats") Integer minSeats,
            @Param("maxPrice") Double maxPrice,
            @Param("searchQuery") String searchQuery);
}
