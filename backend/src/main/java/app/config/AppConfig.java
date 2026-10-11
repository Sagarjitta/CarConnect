package app.config;

import app.model.*;
import app.repository.*;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("CarConnect Peer-to-Peer Car Rental API")
                        .version("1.0.0")
                        .description("REST API documentation for CarConnect – Peer-to-Peer Car Rental Marketplace")
                        .contact(new Contact().name("CarConnect Team").email("support@carconnect.com")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

    @Bean
    public CommandLineRunner initDatabase(
            UserRepository userRepository,
            CarRepository carRepository,
            BookingRepository bookingRepository,
            ReviewRepository reviewRepository,
            PaymentRepository paymentRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin
            if (!userRepository.existsByEmail("admin@carconnect.com")) {
                userRepository.save(User.builder()
                        .fullName("System Administrator")
                        .email("admin@carconnect.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role("ROLE_ADMIN")
                        .phone("+91 9988776655")
                        .city("Bengaluru")
                        .address("CarConnect HQ, MG Road")
                        .status("ACTIVE")
                        .avatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80")
                        .build());
            }

            // Seed Owner 1
            User owner1 = userRepository.findByEmail("owner1@carconnect.com").orElse(null);
            if (owner1 == null) {
                owner1 = userRepository.save(User.builder()
                        .fullName("Rajesh Sharma")
                        .email("owner1@carconnect.com")
                        .password(passwordEncoder.encode("owner123"))
                        .role("ROLE_CAR_OWNER")
                        .phone("+91 9849012345")
                        .city("Bengaluru")
                        .address("Indiranagar 100ft Road, Bengaluru")
                        .status("ACTIVE")
                        .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80")
                        .build());
            }

            // Seed Owner 2
            User owner2 = userRepository.findByEmail("owner2@carconnect.com").orElse(null);
            if (owner2 == null) {
                owner2 = userRepository.save(User.builder()
                        .fullName("Priya Patel")
                        .email("owner2@carconnect.com")
                        .password(passwordEncoder.encode("owner234"))
                        .role("ROLE_CAR_OWNER")
                        .phone("+91 9820054321")
                        .city("Mumbai")
                        .address("Bandra West, Mumbai")
                        .status("ACTIVE")
                        .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80")
                        .build());
            }

            // Seed Customer 1
            User customer1 = userRepository.findByEmail("customer@carconnect.com").orElse(null);
            if (customer1 == null) {
                customer1 = userRepository.save(User.builder()
                        .fullName("Jitta Sagar")
                        .email("customer@carconnect.com")
                        .password(passwordEncoder.encode("customer123"))
                        .role("ROLE_CUSTOMER")
                        .phone("+91 9876543210")
                        .city("Hyderabad")
                        .address("Madhapur, Hitec City, Hyderabad")
                        .status("ACTIVE")
                        .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80")
                        .build());
            }

            // Seed Customer 2
            User customer2 = userRepository.findByEmail("customer2@carconnect.com").orElse(null);
            if (customer2 == null) {
                customer2 = userRepository.save(User.builder()
                        .fullName("Anita Roy")
                        .email("customer2@carconnect.com")
                        .password(passwordEncoder.encode("customer123"))
                        .role("ROLE_CUSTOMER")
                        .phone("+91 9123456789")
                        .city("Delhi")
                        .address("Connaught Place, New Delhi")
                        .status("ACTIVE")
                        .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80")
                        .build());
            }

            // Seed sample car fleet if empty
            if (carRepository.count() == 0) {
                // Car 1: BMW M340i xDrive
                Car bmw = Car.builder()
                        .owner(owner1)
                        .brand("BMW")
                        .model("M340i xDrive")
                        .year(2024)
                        .regNumber("KA-01-MJ-3401")
                        .carType("Sedan")
                        .fuelType("Petrol")
                        .transmission("Automatic")
                        .seats(5)
                        .pricePerDay(6500.0)
                        .city("Bengaluru")
                        .locationAddress("Indiranagar Metro Station, Bengaluru")
                        .description("Twin-power turbo 3.0L inline-six delivering 382 hp. Premium leather upholstery, Harman Kardon audio, sunroof, and all-wheel drive stability.")
                        .features("GPS Navigation, Sunroof, 360 Camera, Heated Seats, Bluetooth, Harman Kardon Sound, Wireless Apple CarPlay, Cruise Control")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                bmw.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                bmw.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80").isPrimary(false).build());
                bmw = carRepository.save(bmw);

                // Car 2: Tesla Model 3 Long Range
                Car tesla = Car.builder()
                        .owner(owner2)
                        .brand("Tesla")
                        .model("Model 3 Long Range")
                        .year(2023)
                        .regNumber("MH-02-EV-8822")
                        .carType("Sedan")
                        .fuelType("Electric")
                        .transmission("Automatic")
                        .seats(5)
                        .pricePerDay(7200.0)
                        .city("Mumbai")
                        .locationAddress("Bandra Kurla Complex (BKC), Mumbai")
                        .description("Zero emissions, dual motor AWD, 0-100 km/h in 4.2 seconds. Includes Autopilot, glass roof, and premium entertainment system.")
                        .features("Autopilot, Glass Roof, Heated Seats, Wireless Charging, Dashcam, Premium Audio, Supercharger Access, Keyless Go")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                tesla.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                tesla.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1000&q=80").isPrimary(false).build());
                tesla = carRepository.save(tesla);

                // Car 3: Mahindra Thar 4x4 Hard Top
                Car thar = Car.builder()
                        .owner(owner1)
                        .brand("Mahindra")
                        .model("Thar 4x4 Hard Top")
                        .year(2023)
                        .regNumber("TS-09-TH-4444")
                        .carType("SUV")
                        .fuelType("Diesel")
                        .transmission("Manual")
                        .seats(4)
                        .pricePerDay(3800.0)
                        .city("Hyderabad")
                        .locationAddress("Gachibowli Stadium Road, Hyderabad")
                        .description("Legendary off-roader with shift-on-the-fly 4WD, high ground clearance, rugged all-terrain capability, and waterproof interior controls.")
                        .features("4x4 High/Low, Touchscreen Infotainment, Adventure Statistics, Roll Cage, All-Terrain Tyres, Bluetooth")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                thar.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                thar.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80").isPrimary(false).build());
                thar = carRepository.save(thar);

                // Car 4: Hyundai Creta SX(O)
                Car creta = Car.builder()
                        .owner(owner2)
                        .brand("Hyundai")
                        .model("Creta SX(O) Turbo")
                        .year(2024)
                        .regNumber("TS-08-CR-9090")
                        .carType("SUV")
                        .fuelType("Petrol")
                        .transmission("Automatic")
                        .seats(5)
                        .pricePerDay(2900.0)
                        .city("Hyderabad")
                        .locationAddress("Hitec City Cyber Towers, Hyderabad")
                        .description("Smooth urban SUV with panoramic sunroof, ventilated front seats, Bose 8-speaker sound, and Level 2 ADAS safety suite.")
                        .features("Panoramic Sunroof, Ventilated Seats, ADAS Safety, Bose Audio, 360 Camera, Wireless Android Auto, Paddle Shifters")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                creta.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                creta = carRepository.save(creta);

                // Car 5: Mercedes-Benz E-Class Luxury
                Car benz = Car.builder()
                        .owner(owner1)
                        .brand("Mercedes-Benz")
                        .model("E-Class Exclusive")
                        .year(2023)
                        .regNumber("KA-03-MB-2200")
                        .carType("Luxury")
                        .fuelType("Diesel")
                        .transmission("Automatic")
                        .seats(5)
                        .pricePerDay(9500.0)
                        .city("Bengaluru")
                        .locationAddress("UB City, Vittal Mallya Road, Bengaluru")
                        .description("Executive luxury sedan featuring chauffeur package reclining rear seats, Burmester 3D surround sound, and ambient lighting.")
                        .features("Chauffeur Package, Burmester Sound, Reclining Rear Seats, Air Suspension, Panoramic Sunroof, Wireless Charging")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                benz.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                benz = carRepository.save(benz);

                // Car 6: Tata Nexon EV Max
                Car nexon = Car.builder()
                        .owner(owner2)
                        .brand("Tata")
                        .model("Nexon EV Max")
                        .year(2024)
                        .regNumber("DL-01-EV-3311")
                        .carType("SUV")
                        .fuelType("Electric")
                        .transmission("Automatic")
                        .seats(5)
                        .pricePerDay(2400.0)
                        .city("Delhi")
                        .locationAddress("Aerocity Terminal 3, New Delhi")
                        .description("Compact all-electric SUV with 453 km ARAI range, multi-mode regenerative braking, and 5-star GNCAP safety rating.")
                        .features("Fast DC Charging, Sunroof, Harman Infotainment, Electronic Parking Brake, Wireless Charging, Air Purifier")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                nexon.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                nexon = carRepository.save(nexon);

                // Car 7: Porsche 911 Carrera
                Car porsche = Car.builder()
                        .owner(owner1)
                        .brand("Porsche")
                        .model("911 Carrera S")
                        .year(2023)
                        .regNumber("MH-01-PO-9911")
                        .carType("Luxury")
                        .fuelType("Petrol")
                        .transmission("Automatic")
                        .seats(2)
                        .pricePerDay(18000.0)
                        .city("Mumbai")
                        .locationAddress("Marine Drive, Nariman Point, Mumbai")
                        .description("The quintessential sports car with 3.0L twin-turbo boxer-6, sport chrono package, active suspension, and intoxicating sports exhaust note.")
                        .features("Sport Chrono Package, Sport Exhaust, PASM Suspension, Bose Surround Sound, Ceramic Brakes, Apple CarPlay")
                        .isPublished(true)
                        .status("ACTIVE")
                        .build();
                porsche.addImage(CarImage.builder().imageUrl("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80").isPrimary(true).build());
                porsche = carRepository.save(porsche);

                // Seed sample completed booking and review
                LocalDate pastStart = LocalDate.now().minusDays(10);
                LocalDate pastEnd = LocalDate.now().minusDays(7);
                Booking sampleBooking = Booking.builder()
                        .car(bmw)
                        .customer(customer1)
                        .startDate(pastStart)
                        .endDate(pastEnd)
                        .totalDays(3)
                        .pricePerDay(bmw.getPricePerDay())
                        .totalPrice(3 * bmw.getPricePerDay())
                        .status("COMPLETED")
                        .notes("Trip to Coorg. Great highway drive.")
                        .createdAt(LocalDateTime.now().minusDays(11))
                        .build();
                Booking savedBooking = bookingRepository.save(sampleBooking);

                Payment samplePayment = Payment.builder()
                        .booking(savedBooking)
                        .amount(savedBooking.getTotalPrice())
                        .paymentMethod("CARD")
                        .transactionRef("TXN-CC-INIT-001")
                        .status("SUCCESS")
                        .paymentDate(LocalDateTime.now().minusDays(11))
                        .build();
                paymentRepository.save(samplePayment);
                savedBooking.setPayment(samplePayment);
                bookingRepository.save(savedBooking);

                // Sample Review
                reviewRepository.save(Review.builder()
                        .car(bmw)
                        .customer(customer1)
                        .rating(5)
                        .comment("Incredible machine! Rajesh was an exceptional host, car was spotless and the engine power is breathtaking. Highly recommend!")
                        .createdAt(LocalDateTime.now().minusDays(6))
                        .build());

                reviewRepository.save(Review.builder()
                        .car(tesla)
                        .customer(customer2)
                        .rating(5)
                        .comment("Silky smooth drive around Mumbai. Priya gave a thorough briefing on the charging stations. 10/10 experience.")
                        .createdAt(LocalDateTime.now().minusDays(3))
                        .build());
            }
        };
    }
}
