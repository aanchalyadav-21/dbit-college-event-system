# COLLEGE EVENT MANAGEMENT SYSTEM — DBIT
## Mini-Project Report (B.Tech Semester 3 — Computer Engineering)

---

### Cover Page & Student Details Placeholder

**Project Title:** College Event Management System (DBIT)  
**Course:** B.Tech Computer Engineering (Semester 3)  
**Academic Year:** 2026–2027  
**Department:** Department of Computer Engineering  
**Institute:** Don Bosco Institute of Technology (DBIT), Premierlines, Kurla (W), Mumbai - 400070  

**Submitted by:**
- Student A: `[Student Name 1]` — Roll No: `[Roll 1]`
- Student B: `[Student Name 2]` — Roll No: `[Roll 2]`

**Project Mentor / Guide:**
- Prof. `[Guide Name]`

---

## 1. Abstract
The **College Event Management System (DBIT)** is a full-stack web application designed to streamline the planning, scheduling, venue allocation, and student registration for college events. Traditional event registration systems in colleges often suffer from duplicate entries, venue overcrowding due to missing capacity checks, and lack of real-time visibility into registrations. 

This application bridges these gaps by adopting a robust 3-tier architecture built with **React** on the frontend, **Java Spring Boot** on the backend, and **MySQL** for relational persistence. The system enforces relational integrity through foreign keys, checks venue capacity before accepting registrations, and permanently prevents duplicate student registrations through composite unique constraints in MySQL. The system provides an interactive dashboard reflecting live database calculations without hardcoded metrics.

---

## 2. Problem Statement
College campuses host diverse events across technical, cultural, sports, and workshop categories. When managed through spreadsheets or generic form builders:
1. There is no automated link between event venues, capacity limits, and registrations.
2. Students frequently submit duplicate registrations for the same event, corrupting attendance data.
3. Event coordinators lack a unified dashboard to review event budgets, attendee rosters, and venue availability.
4. Deleting an event with active registrations can cause orphaned records or data inconsistencies.

---

## 3. Objectives
- Implement a 3-tier, decoupled architecture separating UI, business logic, and database storage.
- Develop RESTful APIs following strict CRUD conventions using Spring Boot 3 and Java 17+.
- Design a 3NF normalized MySQL database enforcing primary keys, foreign keys, and unique constraints.
- Provide a responsive React interface with real-time validation, modals, and dynamic feedback.
- Guarantee that no student can register twice for the same event via both backend and database constraints.
- Prevent accidental deletion of events or venues that have active dependencies.

---

## 4. Scope and Limitations
### Scope
- **Event Management:** Create, view, search, filter, update, and safely delete events.
- **Organizer Management:** Maintain faculty and council organizers connected to events.
- **Venue Management:** Track campus halls, auditoriums, capacities, and locations.
- **Student Registration:** Enroll students into events with capacity checks and instant digital slips.
- **Registration Management:** View and cancel student registrations safely.
- **Executive Dashboard:** Live metrics derived directly from MySQL queries.

### Limitations
- The system is built for a controlled campus intranet or demonstration environment without public internet authentication (JWT or OAuth2 is slated for future enhancements).
- No online monetary payment gateway is included; budgets represent college-sanctioned financial allocations.

---

## 5. Hardware and Software Requirements
### Software Requirements
- **Operating System:** Windows 10/11, Linux, or macOS
- **JDK:** Java Development Kit (JDK 17 or higher)
- **Database:** MySQL Server 8.0 or 8.4
- **Node.js:** Node.js v18.0+ & npm v9.0+
- **Build Tools:** Maven 3.9+ (bundled via `mvnw`) & Vite
- **API Testing:** Postman v10+

### Minimum Hardware Requirements
- **Processor:** Dual-Core 2.0 GHz or higher (Intel Core i3/i5 or AMD Ryzen)
- **RAM:** 4 GB RAM (8 GB recommended for running IDE, Spring Boot, and MySQL concurrently)
- **Disk Storage:** At least 1 GB of free disk space

---

## 6. Functional & Non-Functional Requirements
### Functional Requirements
1. **FR1 - Dashboard Analytics:** Display total events, upcoming events, total registrations, category breakdown, and upcoming schedule.
2. **FR2 - Event CRUD:** Allow authorized coordinators to add, edit, search, filter, and delete events.
3. **FR3 - Venue Capacity Control:** Restrict registrations once venue capacity is reached.
4. **FR4 - Duplicate Registration Prevention:** Enforce `UNIQUE (Participant_ID, Event_ID)`.
5. **FR5 - Safe Deletion:** Restrict deletion of any event with registered attendees or venue with scheduled events.

### Non-Functional Requirements
1. **Performance:** API response times under 200ms on a local server.
2. **Data Integrity:** Strict enforcement of foreign keys with `ON DELETE RESTRICT`.
3. **Usability:** Clean academic color palette, responsive design, and informative alert banners.
4. **Maintainability:** Modular Controller-Service-Repository-Entity architecture.

---

## 7. System Architecture
```
[ User Browser ]
       | (HTTP/JSON on Port 5173)
       v
[ React SPA ] --- (Axios Client) ---> [ Spring Boot REST API (Port 8080) ]
                                                |
                                      +---------+---------+
                                      | Controller Layer  |
                                      +---------+---------+
                                                |
                                      +---------+---------+
                                      |   Service Layer   |
                                      +---------+---------+
                                                |
                                      +---------+---------+
                                      |  Repository Layer |
                                      +---------+---------+
                                                | (HikariCP / JDBC)
                                                v
                                      [ MySQL Database (Port 3306) ]
```

---

## 8. Relational Schema & Data Dictionary

### Tables Overview
1. **Organizer** (`Organizer_ID` [PK], `Name`, `Email` [UK])
2. **Venue** (`Venue_ID` [PK], `Name`, `Capacity`, `Area`, `City`, `Landmark`)
3. **Participant** (`Participant_ID` [PK], `First_Name`, `Last_Name`, `DOB`, `Email` [UK])
4. **Event** (`Event_ID` [PK], `Event_Name`, `Description`, `Category`, `Date`, `Time`, `Budget`, `Organizer_ID` [FK], `Venue_ID` [FK])
5. **Registration** (`Registration_ID` [PK], `Participant_ID` [FK], `Event_ID` [FK], `Registration_Date`, `UNIQUE(Participant_ID, Event_ID)`)

---

## 9. REST API Summary

| Module | Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/dashboard/summary` | Real-time database summary | `200 OK` |
| **Events** | `GET` | `/api/events` | List all events (supports `?search` and `?category`) | `200 OK` |
| | `GET` | `/api/events/{id}` | Event details with venue and attendees | `200 OK` |
| | `POST` | `/api/events` | Create new event with validation | `201 Created` |
| | `PUT` | `/api/events/{id}` | Update event details | `200 OK` |
| | `DELETE` | `/api/events/{id}` | Safe delete (blocked if registrations exist) | `200 OK / 400 Bad Request` |
| **Organizers**| `GET` | `/api/organizers` | List all organizers | `200 OK` |
| | `POST` | `/api/organizers` | Add new organizer | `201 Created` |
| **Venues** | `GET` | `/api/venues` | List campus venues | `200 OK` |
| | `POST` | `/api/venues` | Add venue with capacity | `201 Created` |
| **Registrations** | `POST` | `/api/registrations` | Register student (checks duplicate & capacity) | `201 Created / 409 Conflict` |
| | `GET` | `/api/registrations` | List all registrations | `200 OK` |
| | `GET` | `/api/registrations/event/{id}` | List registrations for specific event | `200 OK` |
| | `DELETE` | `/api/registrations/{id}` | Cancel registration | `200 OK` |

---

## 10. Test Cases & Verification Results

| Test Case ID | Scenario / Test Description | Input Data | Expected Result | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Create Event with valid data | Name: "Web Dev Bootcamp", Category: "Workshop", Budget: 15000 | Event record saved with HTTP 201 | Event appears in catalog with ID assigned | **PASS** |
| **TC-02** | Create Event with negative budget | Budget: -500 | Validation error returned (HTTP 400) | Red warning displayed: "Budget cannot be negative" | **PASS** |
| **TC-03** | Successful Student Registration | Aarav Mehta, `aarav@student.dbit.ac.in`, Event ID: 1 | Registration saved with HTTP 201, slip displayed | Digital confirmation slip generated | **PASS** |
| **TC-04** | Duplicate Student Registration | Same student registers again for Event ID: 1 | HTTP 409 Conflict, error message | Alert displayed: "Participant is already registered for this event" | **PASS** |
| **TC-05** | Delete Event with active registrations | Delete "Hackathon DBIT 2026" (has 3 students) | Deletion blocked with HTTP 400 | Alert displayed: "Cannot delete event because 3 students are registered" | **PASS** |
| **TC-06** | Filter Events by Category | Category: "Technical" | Only technical events displayed | Catalog updates instantly to show matching events | **PASS** |
| **TC-07** | Search Event by Keyword | Search: "Hackathon" | Matching event card displayed | Matching card shown; non-matching hidden | **PASS** |

---

## 11. Screenshots Capture Guide for Report Submission

To finalize your submission report, capture the following 6 screens from your running application:
1. **Figure 1 — Executive Dashboard:** Showing the 4 metric cards, category progress bars, and upcoming events table.
2. **Figure 2 — Events Catalog:** Showing event cards with category tags, organizer name, venue, budget, and action buttons.
3. **Figure 3 — Add / Edit Event Modal:** Showing the form with category dropdown, organizer selector, and venue selector.
4. **Figure 4 — Student Registration Form:** Showing the 2-step registration process and event selection.
5. **Figure 5 — Registration Confirmation Slip:** Showing the confirmed slip with unique Slip ID, student name, and event details.
6. **Figure 6 — Duplicate Registration Prevention Alert:** Showing the red notification banner preventing a duplicate entry.

---

## 12. Conclusion & Future Enhancements
The **College Event Management System (DBIT)** successfully implements all requirements of the Semester 3 Full-Stack Application syllabus. It demonstrates clean object-oriented Java programming, relational integrity enforcement in MySQL, decoupled RESTful APIs, and an interactive React frontend.

### Future Enhancements
1. **Authentication & Authorization:** Integration of Spring Security with JWT tokens and distinct roles for Students, Faculty Coordinators, and HODs.
2. **Automated Attendance via QR Codes:** Generating a unique QR code on the student registration slip that organizers can scan at the venue entrance.
3. **Automated Email Notifications:** Integrating JavaMailSender to dispatch PDF registration passes directly to student college emails.
