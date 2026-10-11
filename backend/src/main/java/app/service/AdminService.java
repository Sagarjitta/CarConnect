package app.service;

import app.dto.AdminDashboardStats;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Booking;
import app.model.Car;
import app.model.User;
import app.repository.BookingRepository;
import app.repository.CarRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;

    public AdminDashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole("CUSTOMER");
        long totalOwners = userRepository.countByRole("CAR_OWNER");

        long totalCars = carRepository.count();
        long activeCars = carRepository.countByStatus("ACTIVE");

        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus("PENDING");
        long confirmedBookings = bookingRepository.countByStatus("CONFIRMED");
        long completedBookings = bookingRepository.countByStatus("COMPLETED");

        Double totalRevenue = bookingRepository.calculateTotalPlatformVolume();

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalOwners(totalOwners)
                .totalCars(totalCars)
                .activeCars(activeCars)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .completedBookings(completedBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String upper = status.trim().toUpperCase();
        if (!upper.equals("ACTIVE") && !upper.equals("SUSPENDED")) {
            throw new BadRequestException("Status must be ACTIVE or SUSPENDED");
        }

        user.setStatus(upper);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new BadRequestException("Cannot delete platform administrator");
        }
        userRepository.delete(user);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Transactional
    public Car updateCarStatus(Long carId, String status) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car", "id", carId));

        String upper = status.trim().toUpperCase();
        if (!upper.equals("ACTIVE") && !upper.equals("SUSPENDED")) {
            throw new BadRequestException("Status must be ACTIVE or SUSPENDED");
        }

        car.setStatus(upper);
        return carRepository.save(car);
    }

    @Transactional
    public void deleteCar(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car", "id", carId));
        carRepository.delete(car);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        booking.setStatus(status.trim().toUpperCase());
        return bookingRepository.save(booking);
    }
}
