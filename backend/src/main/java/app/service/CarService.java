package app.service;

import app.dto.CarRequest;
import app.dto.OwnerAnalyticsResponse;
import app.exception.BadRequestException;
import app.exception.ResourceNotFoundException;
import app.model.Booking;
import app.model.Car;
import app.model.CarImage;
import app.model.User;
import app.repository.BookingRepository;
import app.repository.CarImageRepository;
import app.repository.CarRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<Car> searchCars(String city, String carType, String fuelType,
                               String transmission, Integer minSeats, Double maxPrice,
                               String searchQuery, LocalDate startDate, LocalDate endDate) {
        String cityParam = (city != null && !city.isBlank()) ? city.trim() : null;
        String typeParam = (carType != null && !carType.isBlank()) ? carType.trim() : null;
        String fuelParam = (fuelType != null && !fuelType.isBlank()) ? fuelType.trim() : null;
        String transParam = (transmission != null && !transmission.isBlank()) ? transmission.trim() : null;
        String queryParam = (searchQuery != null && !searchQuery.isBlank()) ? searchQuery.trim() : null;

        List<Car> candidateCars = carRepository.searchAvailableCars(
                cityParam, typeParam, fuelParam, transParam, minSeats, maxPrice, queryParam);

        // If dates are provided, filter out cars that have overlapping confirmed bookings
        if (startDate != null && endDate != null) {
            return candidateCars.stream().filter(car -> {
                List<Booking> conflicts = bookingRepository.findOverlappingConfirmedBookings(car.getId(), startDate, endDate);
                return conflicts.isEmpty();
            }).toList();
        }

        return candidateCars;
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car", "id", id));
    }

    public List<Car> getOwnerCars(Long ownerId) {
        return carRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    @Transactional
    public Car createCar(CarRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));

        if (carRepository.existsByRegNumber(request.getRegNumber().trim().toUpperCase())) {
            throw new BadRequestException("A car with registration number '" + request.getRegNumber() + "' is already listed");
        }

        Car car = Car.builder()
                .owner(owner)
                .brand(request.getBrand().trim())
                .model(request.getModel().trim())
                .year(request.getYear())
                .regNumber(request.getRegNumber().trim().toUpperCase())
                .carType(request.getCarType().trim())
                .fuelType(request.getFuelType().trim())
                .transmission(request.getTransmission().trim())
                .seats(request.getSeats())
                .pricePerDay(request.getPricePerDay())
                .city(request.getCity().trim())
                .locationAddress(request.getLocationAddress())
                .description(request.getDescription())
                .features(request.getFeatures())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .status("ACTIVE")
                .images(new ArrayList<>())
                .build();

        Car savedCar = carRepository.save(car);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            boolean first = true;
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    CarImage image = CarImage.builder()
                            .car(savedCar)
                            .imageUrl(url.trim())
                            .isPrimary(first)
                            .build();
                    savedCar.addImage(image);
                    first = false;
                }
            }
            savedCar = carRepository.save(savedCar);
        }

        return savedCar;
    }

    @Transactional
    public Car updateCar(Long carId, CarRequest request, Long ownerId, boolean isAdmin) {
        Car car = getCarById(carId);

        if (!isAdmin && !car.getOwner().getId().equals(ownerId)) {
            throw new BadRequestException("You are not authorized to edit this car listing");
        }

        String newReg = request.getRegNumber().trim().toUpperCase();
        if (!car.getRegNumber().equalsIgnoreCase(newReg) && carRepository.existsByRegNumber(newReg)) {
            throw new BadRequestException("Registration number '" + newReg + "' is already in use");
        }

        car.setBrand(request.getBrand().trim());
        car.setModel(request.getModel().trim());
        car.setYear(request.getYear());
        car.setRegNumber(newReg);
        car.setCarType(request.getCarType().trim());
        car.setFuelType(request.getFuelType().trim());
        car.setTransmission(request.getTransmission().trim());
        car.setSeats(request.getSeats());
        car.setPricePerDay(request.getPricePerDay());
        car.setCity(request.getCity().trim());
        car.setLocationAddress(request.getLocationAddress());
        car.setDescription(request.getDescription());
        car.setFeatures(request.getFeatures());
        if (request.getIsPublished() != null) {
            car.setIsPublished(request.getIsPublished());
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            car.getImages().clear();
            boolean first = true;
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    CarImage img = CarImage.builder()
                            .car(car)
                            .imageUrl(url.trim())
                            .isPrimary(first)
                            .build();
                    car.addImage(img);
                    first = false;
                }
            }
        }

        return carRepository.save(car);
    }

    @Transactional
    public void deleteCar(Long carId, Long ownerId, boolean isAdmin) {
        Car car = getCarById(carId);

        if (!isAdmin && !car.getOwner().getId().equals(ownerId)) {
            throw new BadRequestException("You are not authorized to delete this car");
        }

        List<Booking> upcoming = bookingRepository.findByCarIdOrderByCreatedAtDesc(carId)
                .stream()
                .filter(b -> "CONFIRMED".equalsIgnoreCase(b.getStatus()) || "PENDING".equalsIgnoreCase(b.getStatus()))
                .toList();

        if (!upcoming.isEmpty()) {
            throw new BadRequestException("Cannot delete car with active or pending booking reservations. Please complete or cancel them first.");
        }

        carRepository.delete(car);
    }

    @Transactional
    public Car togglePublish(Long carId, Long ownerId, boolean isAdmin) {
        Car car = getCarById(carId);

        if (!isAdmin && !car.getOwner().getId().equals(ownerId)) {
            throw new BadRequestException("You are not authorized to modify this car");
        }

        car.setIsPublished(!car.getIsPublished());
        return carRepository.save(car);
    }

    public OwnerAnalyticsResponse getOwnerAnalytics(Long ownerId) {
        List<Car> ownerCars = carRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
        List<Booking> ownerBookings = bookingRepository.findByCarOwnerIdOrderByCreatedAtDesc(ownerId);

        Double earnings = bookingRepository.calculateOwnerEarnings(ownerId);

        long activeListings = ownerCars.stream().filter(c -> c.getIsPublished() && "ACTIVE".equalsIgnoreCase(c.getStatus())).count();
        long pendingRequests = ownerBookings.stream().filter(b -> "PENDING".equalsIgnoreCase(b.getStatus())).count();
        long completedRentals = ownerBookings.stream().filter(b -> "COMPLETED".equalsIgnoreCase(b.getStatus())).count();

        return OwnerAnalyticsResponse.builder()
                .totalEarnings(earnings != null ? earnings : 0.0)
                .totalBookings(ownerBookings.size())
                .activeListings(activeListings)
                .completedRentals(completedRentals)
                .pendingRequests(pendingRequests)
                .build();
    }
}
