package app.service;

import app.dto.BookingCreateRequest;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Booking;
import app.model.Car;
import app.model.Notification;
import app.model.User;
import app.repository.BookingRepository;
import app.repository.CarRepository;
import app.repository.NotificationRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
    }

    public List<Booking> getCustomerBookings(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", customerEmail));
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
    }

    public List<Booking> getOwnerBookings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", ownerEmail));
        return bookingRepository.findByCarOwnerIdOrderByCreatedAtDesc(owner.getId());
    }

    @Transactional
    public Booking createBooking(BookingCreateRequest request, String customerEmail) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }

        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Pickup date cannot be in the past");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Return date cannot be earlier than pickup date");
        }

        User customer = userRepository.findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", customerEmail));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car", "id", request.getCarId()));

        // Prevent owner from booking their own car
        if (car.getOwner().getId().equals(customer.getId())) {
            throw new BadRequestException("You cannot rent or book your own car listing");
        }

        // Prevent booking unpublished or inactive cars
        if (!Boolean.TRUE.equals(car.getIsPublished()) || !"ACTIVE".equalsIgnoreCase(car.getStatus())) {
            throw new BadRequestException("This car is currently unpublished or unavailable for rental");
        }

        // Check for overlapping confirmed bookings
        List<Booking> conflicts = bookingRepository.findOverlappingConfirmedBookings(
                car.getId(), request.getStartDate(), request.getEndDate());

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("This car already has a confirmed booking for the selected dates. Please select alternative dates.");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days == 0) {
            days = 1; // Minimum 1 day rental
        }

        double totalPrice = days * car.getPricePerDay();

        Booking booking = Booking.builder()
                .car(car)
                .customer(customer)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalDays((int) days)
                .pricePerDay(car.getPricePerDay())
                .totalPrice(totalPrice)
                .status("PENDING")
                .notes(request.getNotes())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Notify car owner
        Notification ownerNotification = Notification.builder()
                .user(car.getOwner())
                .title("New Booking Request")
                .message("You received a rental request for " + car.getBrand() + " " + car.getModel() +
                        " from " + customer.getFullName() + " for " + days + " days (₹" + totalPrice + ").")
                .build();
        notificationRepository.save(ownerNotification);

        return savedBooking;
    }

    @Transactional
    public Booking acceptBooking(Long bookingId, String userEmail, boolean isAdmin) {
        Booking booking = getBookingById(bookingId);
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!isAdmin && !booking.getCar().getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Only the car owner can accept this booking request");
        }

        if (!"PENDING".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only pending bookings can be accepted (current: " + booking.getStatus() + ")");
        }

        // Re-check overlap before confirming
        List<Booking> conflicts = bookingRepository.findOverlappingConfirmedBookings(
                booking.getCar().getId(), booking.getStartDate(), booking.getEndDate());
        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Cannot confirm: Another booking on these dates was already confirmed for this car.");
        }

        booking.setStatus("CONFIRMED");
        Booking updated = bookingRepository.save(booking);

        // Notify customer
        Notification custNotification = Notification.builder()
                .user(booking.getCustomer())
                .title("Booking Confirmed!")
                .message("Great news! Your booking request for " + booking.getCar().getBrand() + " " +
                        booking.getCar().getModel() + " has been approved by the owner. Complete payment to secure checkout.")
                .build();
        notificationRepository.save(custNotification);

        return updated;
    }

    @Transactional
    public Booking rejectBooking(Long bookingId, String userEmail, boolean isAdmin, String reason) {
        Booking booking = getBookingById(bookingId);
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!isAdmin && !booking.getCar().getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Only the car owner can reject this booking request");
        }

        if (!"PENDING".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only pending booking requests can be rejected");
        }

        booking.setStatus("REJECTED");
        Booking updated = bookingRepository.save(booking);

        String reasonMsg = (reason != null && !reason.isBlank()) ? " Reason: " + reason : "";
        Notification custNotification = Notification.builder()
                .user(booking.getCustomer())
                .title("Booking Request Declined")
                .message("The owner could not accommodate your rental request for " +
                        booking.getCar().getBrand() + " " + booking.getCar().getModel() + "." + reasonMsg)
                .build();
        notificationRepository.save(custNotification);

        return updated;
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail, boolean isAdmin) {
        Booking booking = getBookingById(bookingId);
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());
        boolean isOwner = booking.getCar().getOwner().getId().equals(user.getId());

        if (!isAdmin && !isCustomer && !isOwner) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if ("COMPLETED".equalsIgnoreCase(booking.getStatus()) || "CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot cancel a booking with status " + booking.getStatus());
        }

        booking.setStatus("CANCELLED");
        Booking updated = bookingRepository.save(booking);

        // Notify counterparty
        User notifyUser = isCustomer ? booking.getCar().getOwner() : booking.getCustomer();
        String cancelledBy = isCustomer ? "customer" : (isOwner ? "car owner" : "administrator");

        Notification cancelNotification = Notification.builder()
                .user(notifyUser)
                .title("Booking Cancelled")
                .message("The booking #" + booking.getId() + " for " + booking.getCar().getBrand() + " " +
                        booking.getCar().getModel() + " was cancelled by the " + cancelledBy + ".")
                .build();
        notificationRepository.save(cancelNotification);

        return updated;
    }

    @Transactional
    public Booking completeBooking(Long bookingId, String userEmail, boolean isAdmin) {
        Booking booking = getBookingById(bookingId);
        User user = userRepository.findByEmail(userEmail.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (!isAdmin && !booking.getCar().getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("Only the car owner or admin can mark a rental as completed");
        }

        if (!"CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only confirmed bookings can be marked as completed");
        }

        booking.setStatus("COMPLETED");
        Booking updated = bookingRepository.save(booking);

        Notification custNotification = Notification.builder()
                .user(booking.getCustomer())
                .title("Rental Trip Completed")
                .message("Your rental for " + booking.getCar().getBrand() + " " + booking.getCar().getModel() +
                        " is now complete! Don't forget to share your rating and review.")
                .build();
        notificationRepository.save(custNotification);

        return updated;
    }
}
