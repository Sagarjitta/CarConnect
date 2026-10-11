package app;

import app.dto.AuthResponse;
import app.dto.BookingCreateRequest;
import app.dto.CarRequest;
import app.dto.RegisterRequest;
import app.exception.BadRequestException;
import app.model.Booking;
import app.model.Car;
import app.model.User;
import app.repository.BookingRepository;
import app.repository.CarRepository;
import app.repository.UserRepository;
import app.service.AuthService;
import app.service.BookingService;
import app.service.CarService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CarConnectServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private CarService carService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private User testOwner;
    private User testCustomer;
    private Car testCar;

    @BeforeEach
    void setUp() {
        testOwner = userRepository.findByEmail("test_owner@carconnect.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .fullName("Test Owner")
                        .email("test_owner@carconnect.com")
                        .password("password123")
                        .role("ROLE_CAR_OWNER")
                        .city("Hyderabad")
                        .status("ACTIVE")
                        .build()));

        testCustomer = userRepository.findByEmail("test_cust@carconnect.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .fullName("Test Customer")
                        .email("test_cust@carconnect.com")
                        .password("password123")
                        .role("ROLE_CUSTOMER")
                        .city("Hyderabad")
                        .status("ACTIVE")
                        .build()));

        testCar = carRepository.save(Car.builder()
                .owner(testOwner)
                .brand("Audi")
                .model("A6")
                .year(2023)
                .regNumber("TS-09-AU-9999")
                .carType("Sedan")
                .fuelType("Petrol")
                .transmission("Automatic")
                .seats(5)
                .pricePerDay(5000.0)
                .city("Hyderabad")
                .isPublished(true)
                .status("ACTIVE")
                .build());
    }

    @Test
    void testUserRegistrationAndRole() {
        RegisterRequest req = RegisterRequest.builder()
                .fullName("New Host")
                .email("new_host@carconnect.com")
                .password("securePass123")
                .role("CAR_OWNER")
                .city("Bengaluru")
                .build();

        AuthResponse resp = authService.register(req);
        assertNotNull(resp.getToken());
        assertEquals("new_host@carconnect.com", resp.getUser().getEmail());
        assertEquals("CAR_OWNER", resp.getUser().getRole());
    }

    @Test
    void testCarCreationAndSearch() {
        CarRequest carReq = CarRequest.builder()
                .brand("Mercedes")
                .model("C-Class")
                .year(2024)
                .regNumber("TS-07-MB-1122")
                .carType("Sedan")
                .fuelType("Diesel")
                .transmission("Automatic")
                .seats(5)
                .pricePerDay(6000.0)
                .city("Hyderabad")
                .isPublished(true)
                .imageUrls(List.of("https://example.com/car.jpg"))
                .build();

        Car created = carService.createCar(carReq, testOwner.getId());
        assertNotNull(created.getId());
        assertEquals("Mercedes", created.getBrand());

        List<Car> searchResults = carService.searchCars("Hyderabad", "Sedan", null, null, null, null, null, null, null);
        assertFalse(searchResults.isEmpty());
        assertTrue(searchResults.stream().anyMatch(c -> c.getModel().equals("C-Class")));
    }

    @Test
    void testCustomerCannotBookOwnCar() {
        BookingCreateRequest req = BookingCreateRequest.builder()
                .carId(testCar.getId())
                .startDate(LocalDate.now().plusDays(2))
                .endDate(LocalDate.now().plusDays(4))
                .build();

        // testOwner tries to book their own car
        assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(req, testOwner.getEmail()));
    }

    @Test
    void testBookingLifecycleAndOverlapPrevention() {
        LocalDate start = LocalDate.now().plusDays(5);
        LocalDate end = LocalDate.now().plusDays(8);

        BookingCreateRequest req = BookingCreateRequest.builder()
                .carId(testCar.getId())
                .startDate(start)
                .endDate(end)
                .build();

        // Customer creates booking
        Booking booking1 = bookingService.createBooking(req, testCustomer.getEmail());
        assertEquals("PENDING", booking1.getStatus());
        assertEquals(3 * 5000.0, booking1.getTotalPrice());

        // Owner accepts booking
        Booking confirmed = bookingService.acceptBooking(booking1.getId(), testOwner.getEmail(), false);
        assertEquals("CONFIRMED", confirmed.getStatus());

        // Another customer attempts to book overlapping dates (e.g. plusDays(6) to plusDays(9))
        BookingCreateRequest conflictReq = BookingCreateRequest.builder()
                .carId(testCar.getId())
                .startDate(LocalDate.now().plusDays(6))
                .endDate(LocalDate.now().plusDays(9))
                .build();

        assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(conflictReq, testCustomer.getEmail()));
    }
}
