package app.repository;

import app.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Booking> findByCarOwnerIdOrderByCreatedAtDesc(Long ownerId);

    List<Booking> findByCarIdOrderByCreatedAtDesc(Long carId);

    long countByStatus(String status);

    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId " +
           "AND b.status = 'CONFIRMED' " +
           "AND (b.startDate <= :endDate AND b.endDate >= :startDate)")
    List<Booking> findOverlappingConfirmedBookings(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId " +
           "AND b.status IN ('CONFIRMED', 'PENDING') " +
           "AND (b.startDate <= :endDate AND b.endDate >= :startDate)")
    List<Booking> findOverlappingActiveBookings(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b " +
           "WHERE b.car.owner.id = :ownerId " +
           "AND b.status IN ('CONFIRMED', 'COMPLETED')")
    Double calculateOwnerEarnings(@Param("ownerId") Long ownerId);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b " +
           "WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
    Double calculateTotalPlatformVolume();
}
