# 🚗 CarConnect – Peer-to-Peer Car Rental Platform

**CarConnect** is a modern, responsive, full-stack peer-to-peer car rental web application where car owners list their personal vehicles for rent and customers can browse, reserve, and rent those cars with full booking lifecycle management, automated date conflict prevention, simulated payments, ratings, and administrative oversight.

---

## 🌟 Key Highlights & Architecture

- **Dark Navy Automotive Aesthetics:** Designed with `#0A1128` deep navy, vibrant blue accents (`#2563EB`), clear specification badges, responsive cards, and accessible modals.
- **Role-Based Access Control (RBAC):** Three dedicated roles: `CUSTOMER`, `CAR_OWNER` (Host), and `ADMIN` with Spring Security JWT tokens.
- **Self-Booking Protection:** Car owners are prevented by server-side business rules from renting their own vehicles.
- **Automated Overlap Detection:** Conflict validation prevents overlapping confirmed bookings on conflicting dates for any vehicle.
- **Dynamic Fare Calculation:** Instant price duration multipliers with platform fee breakdowns.
- **Comprehensive Lifecycle Operations:** Booking requests move cleanly through `PENDING` &rarr; `CONFIRMED` / `REJECTED` &rarr; `COMPLETED` / `CANCELLED`.
- **Simulated Payment Gateway:** Card & UPI checkout simulator with generated digital receipts (`txnRef`, print preview).
- **Post-Trip Ratings & Reviews:** Customers leave verified 1–5 star reviews and written feedback after trip completion.
- **Interactive Admin Control Center:** Live platform KPIs, user suspension/moderation, fleet listing approvals, and booking status overrides.

---

## 👥 Demo Accounts (Pre-Seeded & Ready to Use)

You can log in manually or use the **1-Click Demo Buttons** on the Sign-In modal:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@carconnect.com` | `admin123` | System telemetry, user moderation, fleet moderation, booking audits |
| **Car Owner (Host 1)** | `owner1@carconnect.com` | `owner123` | List vehicles, edit pricing, accept/reject bookings, host analytics |
| **Car Owner (Host 2)** | `owner2@carconnect.com` | `owner234` | Manage fleet in Mumbai/Bengaluru, review incoming reservation requests |
| **Customer (Renter 1)** | `customer@carconnect.com` | `customer123` | Browse fleet, rent cars, simulated checkout, view trips, leave reviews |
| **Customer (Renter 2)** | `customer2@carconnect.com` | `customer123` | Browse fleet, filter cars by seats & fuel type, trip reservations |

---

## 📑 15 Completed Views & Pages

1. **Home Page (`/`):** Hero search widget (location, car type, dates), popular categories (SUV, Sedan, Luxury, Electric), featured vehicles, and peer-to-peer value propositions.
2. **Browse Cars Page:** Real-time multi-criteria filtering by city, vehicle category, fuel type, transmission, seating capacity, price slider, and sorting.
3. **Car Details Page:** Image gallery, specifications (seats, fuel, transmission, year), verified host profile, estimated duration calculator, and real customer reviews.
4. **Booking Checkout Page:** Trip dates validation, base fare + platform fee breakdown, notes, simulated payment card/UPI details, and instant submission.
5. **Sign-In Modal:** JWT credential authentication with one-click demo account switcher and error handling.
6. **Registration Modal:** Sign up with role selection (`Customer` or `Car Owner (Host)`), phone number, and password hashing.
7. **Customer Dashboard:** Trip reservation statistics, quick actions, and recent active itineraries.
8. **Owner Dashboard (Host Portal):** Fleet count, total gross earnings, pending requests with direct Accept / Reject controls.
9. **Add/Edit Car Modal:** Vehicle brand, model, manufacturing year, registration number, category, fuel, transmission, seats, price/day, city, description, features, and multi-image URLs.
10. **My Cars (Host Fleet):** List of all cars owned by the host, publish/unpublish visibility toggle, edit modal trigger, and delete car with confirmation.
11. **Booking Management (Host Requests):** Tabbed interface for all incoming booking requests, customer details, rental dates, earnings, and Accept / Decline / Complete trip controls.
12. **My Bookings (Customer Trips):** Filter reservations by status (`ALL`, `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), payment triggers, cancel booking dialog, print digital receipt, and submit reviews.
13. **User Profile Page:** View user details, edit full name & phone number, inspect membership status, and role-based quick action shortcuts.
14. **Admin Dashboard:** Platform KPIs (total users, active cars, bookings, gross revenue), User Moderation table (Suspend / Activate / Delete), Car Moderation table (Approve / Suspend / Delete), and Booking Operations table (status override).
15. **About Us & Contact Pages:** Company mission, safety standards, host monetization program, concierge office coordinates, interactive inquiry submission form, and FAQ accordion.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 5, Tailwind-compatible Modern Automotive CSS, Lucide Icons.
- **Backend:** Java 21, Spring Boot 3.4.4, Spring Security, Spring Data JPA, Hibernate, Lombok.
- **Database:** MySQL 8.4 (with automatic schema migration & initial data seeding).
- **Authentication:** Stateless JWT tokens (`Bearer` tokens in `Authorization` header).
- **Documentation:** OpenAPI 3.0 / Swagger UI.
- **Containerization:** Multi-stage production `Dockerfile` and `docker-compose.yml`.

---

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK):** Version 17 or 21
- **Node.js:** Version 18 or 20+ and `npm`
- **MySQL Database Server:** Running locally on port `3306` (or via Docker)

---

### Method 1: Running with Docker Compose (Recommended)

1. Clone or navigate to the project directory:
   ```bash
   cd d:\Project
   ```
2. Launch the entire application with MySQL in one command:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **Application Web UI:** [http://localhost:8080](http://localhost:8080)
   - **Swagger API Docs:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

### Method 2: Running Locally (Manual Development)

#### 1. Setup MySQL Database

Ensure MySQL is running on port `3306`. Create the database if needed:
```sql
CREATE DATABASE IF NOT EXISTS carconnect;
```
Configure credentials in `backend/src/main/resources/application.properties` or environment variables:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/carconnect?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Sagar
```

#### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
```
*(The build script automatically places production assets into `backend/src/main/resources/static` so Spring Boot serves the complete UI).*

#### 3. Run Backend

```bash
cd ../backend
mvn spring-boot:run
```

#### 4. Access Application

- Open [http://localhost:8080](http://localhost:8080) in your web browser.
- Open [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) for interactive OpenAPI testing.

---

## 🧪 Testing & Verification

Run the automated backend test suite (testing user registration, car catalog search, self-booking rejection, booking lifecycle, and booking date overlap conflict prevention):

```bash
cd backend
mvn test
```

Result:
```text
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 📡 REST API Endpoints Overview

### Authentication & Users
- `POST /api/auth/register` – Register new customer or car owner.
- `POST /api/auth/login` – Authenticate user and receive JWT bearer token.
- `GET /api/users/me` – Retrieve profile of current authenticated user.
- `PUT /api/users/me` – Update profile (name, phone).

### Public Cars & Search
- `GET /api/cars` – Search and filter published cars (`city`, `carType`, `fuelType`, `transmission`, `minSeats`, `maxPrice`, `searchQuery`, `startDate`, `endDate`).
- `GET /api/cars/{id}` – View detailed car specs and verified host details.

### Car Owner (Host Portal)
- `GET /api/owner/cars` – Retrieve all vehicles listed by the authenticated host.
- `POST /api/owner/cars` – List a new car with specs and image URLs.
- `PUT /api/owner/cars/{id}` – Edit car details and daily rental rate.
- `DELETE /api/owner/cars/{id}` – Remove car listing.
- `PATCH /api/owner/cars/{id}/toggle-publish` – Toggle listing visibility.
- `GET /api/owner/analytics` – Host telemetry (total listings, completed rentals, gross earnings).
- `GET /api/owner/bookings` – Incoming rental requests.
- `PATCH /api/owner/bookings/{id}/accept` – Accept rental request (`PENDING` &rarr; `CONFIRMED`).
- `PATCH /api/owner/bookings/{id}/reject` – Decline rental request.
- `PATCH /api/owner/bookings/{id}/complete` – Complete rental trip (`CONFIRMED` &rarr; `COMPLETED`).

### Bookings & Payments
- `POST /api/bookings` – Submit a reservation request (validates dates & prevents overlap).
- `GET /api/bookings/my` – Retrieve bookings made by current customer.
- `PATCH /api/bookings/{id}/cancel` – Cancel an active booking reservation.
- `POST /api/payments/process` – Process simulated payment and mark booking settled.
- `GET /api/payments/booking/{bookingId}` – Fetch digital transaction receipt.

### Reviews & Ratings
- `POST /api/reviews` – Submit review and star rating for a completed trip.
- `GET /api/reviews/car/{carId}` – Get public reviews and ratings for a vehicle.

### Administrator Portal
- `GET /api/admin/dashboard` – Overall platform KPIs and volume metrics.
- `GET /api/admin/users` – User accounts list.
- `PATCH /api/admin/users/{id}/status` – Suspend or activate user account.
- `DELETE /api/admin/users/{id}` – Delete user account.
- `GET /api/admin/cars` – Platform vehicle inventory.
- `PATCH /api/admin/cars/{id}/status` – Moderate/suspend vehicle listing.
- `DELETE /api/admin/cars/{id}` – Remove vehicle from platform.
- `GET /api/admin/bookings` – All platform bookings.
- `PATCH /api/admin/bookings/{id}/status` – Force override booking status.

---

## 🔒 Security & Data Integrity

1. **Password Hashing:** Passwords are encrypted using BCrypt before persistence.
2. **Stateless JWT Authorization:** Every protected route requires a verified JWT token.
3. **Double Booking Guard:** Date overlap queries ensure that conflicting intervals cannot be confirmed for the same car.
4. **Owner Separation:** Validation checks prevent owners from renting their own vehicles.
5. **CORS Protected:** Configured to allow trusted origins while securing API responses.
