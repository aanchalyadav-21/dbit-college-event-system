# Viva Voce & Defense Guide
## College Event Management System – DBIT (B.Tech Semester 3)

This guide prepares you and your partner to answer any question asked by your professors, external examiners, or viva committee with 100% confidence.

---

### Q1. Why was this problem chosen?
**Answer:**  
In colleges like DBIT, department events, workshops, hackathons, and cultural fests are organized frequently. When registrations are handled via manual Google Forms or spreadsheets:
- Multiple registrations by the same student lead to corrupted headcounts.
- Event venues get overcrowded because forms do not validate venue seating capacity.
- Organizers cannot easily track budgets or view category-wise statistics in real time.  
This project automates the entire lifecycle: event creation, venue booking with capacity constraints, student registration with duplicate prevention, and real-time dashboard analytics.

---

### Q2. Why did you choose React, Spring Boot, and MySQL?
**Answer:**
- **React (Frontend):** Provides a single-page application (SPA) experience with fast component-based rendering, client-side validation, and responsive state updates without reloading the entire web page.
- **Spring Boot (Backend):** The enterprise standard in the Java ecosystem. It provides built-in dependency injection, embedded Tomcat server, Spring Data JPA for effortless database persistence, and clean layered architecture (Controller-Service-Repository).
- **MySQL (Database):** A proven Relational Database Management System (RDBMS) that strictly guarantees ACID properties (Atomicity, Consistency, Isolation, Durability) and enforces relational integrity via primary keys, foreign keys, and unique constraints.

---

### Q3. How does Spring Boot compare to traditional Java Servlets and JSP?
**Answer:**
- In **Servlet/JSP**, developers have to write boilerplate JDBC code (`DriverManager.getConnection`, `PreparedStatement`, `ResultSet`), map HTML form parameters manually (`request.getParameter`), manage database connection pools manually, and tightly couple Java code inside HTML using JSP scriptlets (`<% %>`).
- In **Spring Boot with Spring Data JPA**, Hibernate automatically generates SQL queries from method names (`findByCategory`, `countByEvent_EventId`), HikariCP provides high-performance connection pooling out of the box, and REST Controllers exchange clean JSON data instead of messy HTML rendering.

---

### Q4. What happens when a user clicks "Submit Registration"? (Trace the data flow)
**Answer:**
1. **React Form:** The student fills in the form. Client-side validation checks that no fields are empty and the email format is valid.
2. **HTTP Request:** React sends an asynchronous HTTP POST request using `apiClient.js` (Axios) to `http://localhost:8080/api/registrations` with a JSON payload.
3. **Controller:** `RegistrationController` receives the request. `@Valid` executes Bean Validation (`@NotNull`, `@NotBlank`, `@Email`). If invalid, it immediately returns HTTP 400.
4. **Service:** `RegistrationService` executes business logic:
   - Verifies the selected event exists.
   - Verifies the venue capacity is not exceeded.
   - Looks up or creates the `Participant` in MySQL.
   - Checks if this participant has already registered for this event (`existsByParticipant_ParticipantIdAndEvent_EventId`). If yes, throws `DuplicateResourceException`.
5. **Repository & Database:** `RegistrationRepository` executes an `INSERT INTO Registration` SQL statement. MySQL checks its composite unique constraint `(Participant_ID, Event_ID)`.
6. **HTTP Response:** The Controller wraps the saved entity into a `RegistrationResponseDTO` and returns HTTP 201 Created with an `ApiResponse` JSON wrapper.
7. **React UI Update:** React receives the JSON response, turns off the submit spinner, and displays an official registration slip.

---

### Q5. What does each backend layer do?
**Answer:**
- **Entity:** Represents MySQL tables as Java classes using Jakarta Persistence (`@Entity`, `@Table`, `@Column`, `@Id`, `@ManyToOne`).
- **Repository:** Extends `JpaRepository<T, ID>`, providing built-in CRUD operations and custom derived query methods without writing manual SQL.
- **Service:** Contains core business logic, validations (budget >= 0, capacity checks, safe delete checks), and `@Transactional` boundaries.
- **Controller:** Exposes RESTful HTTP endpoints (`@GetMapping`, `@PostMapping`, etc.), handles path variables and query parameters, and returns HTTP status codes.
- **DTO (Data Transfer Object):** Decouples internal database entities from external API payloads, preventing circular JSON serialization and hiding sensitive fields.
- **GlobalExceptionHandler:** Centralized `@RestControllerAdvice` that catches exceptions across all controllers and formats them into clean, friendly JSON responses instead of crashing or exposing raw stack traces.

---

### Q6. What is the role of Primary Keys, Foreign Keys, and Unique Constraints in this project?
**Answer:**
- **Primary Key (`Event_ID`, `Venue_ID`, `Participant_ID`, etc.):** Uniquely identifies each record in a table. It is indexed using a B-Tree for $O(\log n)$ lookup speed.
- **Foreign Key (`Event.Venue_ID -> Venue.Venue_ID`, `Registration.Event_ID -> Event.Event_ID`):** Preserves referential integrity. MySQL will reject any event that references a nonexistent venue.
- **Unique Constraint (`UNIQUE (Participant_ID, Event_ID)`):** A composite unique constraint on the `Registration` table. It permanently prevents any student from registering more than once for the same event at the database engine level.

---

### Q7. Why enforce duplicate registration in the database if the frontend already checks it?
**Answer:**
**Defense:** "Never trust the client alone." A user could open two browser tabs simultaneously, double-click the Submit button rapidly, or use a tool like Postman/cURL to bypass the React frontend entirely. If duplicate prevention were only in the frontend, concurrent requests would cause race conditions and insert duplicate rows. Enforcing `UNIQUE (Participant_ID, Event_ID)` in MySQL guarantees data integrity regardless of how the request was sent.

---

### Q8. How does safe deletion work in this project?
**Answer:**
Foreign keys are configured with `ON DELETE RESTRICT`.  
If an organizer attempts to delete an event that already has registered students:
1. `EventService.deleteEvent(id)` proactively counts registrations using `registrationRepository.countByEvent_EventId(id)`.
2. If count > 0, it throws a `BadRequestException`: *"Cannot delete event because X students are currently registered."*
3. If a direct database delete was attempted, MySQL's foreign key constraint would block it, and `GlobalExceptionHandler` would catch the `DataIntegrityViolationException` and return a safe HTTP 409 response rather than crashing.

---

### Q9. How could a mobile app or a second frontend reuse this backend?
**Answer:**
Because the Spring Boot backend is a pure **stateless REST API** that returns standardized JSON, a React Native mobile app, Flutter app, or another web portal can use the exact same endpoints (`GET /api/events`, `POST /api/registrations`) without modifying any backend code.

---

### Q10. What would become bottlenecks if concurrent users increased 100x?
**Answer:**
1. **Database Connection Pool:** HikariCP defaults to 10 connections. 100x traffic would cause connection starvation while waiting for free database connections.
2. **Database Write Locks:** Simultaneous registrations to the same table would experience row and table lock contention in MySQL.
3. **Repeated Event Listing Queries:** Hundreds of students refreshing the Events page would trigger redundant `SELECT` queries for the exact same event data.

---

### Q11. Where would caching help, and what should NOT be cached?
**Answer:**
- **Good for caching:** The Events catalog and Venue listings (using Redis or Spring `@Cacheable`). Events do not change every second, so serving them from Redis memory saves thousands of database hits.
- **Never cache carelessly:** Seat availability counts and the duplicate-registration check. If cached seat counts lag behind real registrations, two students could register for the very last seat simultaneously, causing overbooking.

---

### Q12. What happens if MySQL is unavailable for 30 seconds?
**Answer:**
- Spring Boot's HikariCP pool will detect dropped connections and attempt reconnection. Incoming requests will receive a `CannotCreateTransactionException` or timeout.
- Our `GlobalExceptionHandler` catches this and returns HTTP 500 with a clean message: *"An unexpected internal error occurred."*
- In React, our `apiClient.js` response interceptor catches the network failure and displays our top `AlertBanner` with a red warning: *"Network error or backend is not running"*, ensuring the UI never crashes or presents a blank white screen.

---

### Q13. Suggest one security improvement and one scalability improvement.
**Answer:**
- **Security Improvement:** Implement Spring Security with **JWT (JSON Web Tokens)** and role-based access control (`ROLE_ADMIN` for Organizers creating events; `ROLE_STUDENT` for students registering). Currently, the system is designed for an academic viva demonstration.
- **Scalability Improvement:** Implement **Redis Caching** for the Event catalog and an asynchronous message queue (**RabbitMQ / Apache Kafka**) to process event registrations asynchronously during peak college fest registrations.
