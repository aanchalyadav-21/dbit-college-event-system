# College Event Management System — DBIT
**Full-Stack B.Tech Semester 3 Mini-Project (Computer Engineering)**  
**Don Bosco Institute of Technology (DBIT), Mumbai**

---

## 📌 Technology Stack

- **Frontend:** React 19, JavaScript (ES6+), HTML5, Custom Academic CSS Design System, Lucide Icons, Axios
- **Backend:** Java 17+, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Jakarta Bean Validation
- **Database:** MySQL Server 8.0 / 8.4 (`dbit_event_management`)
- **Build Tools:** Maven Wrapper (`mvnw.cmd` / `mvnw`) & Vite
- **Testing:** Postman Collection included

---

## 📁 Project Directory Structure

```
dbit-college-event-system/
├── backend/                              # Spring Boot Application (Port 8080)
│   ├── mvnw / mvnw.cmd                   # Maven wrapper
│   ├── pom.xml                           # Dependencies
│   └── src/main/
│       ├── java/com/dbit/eventsystem/
│       │   ├── DbitEventSystemApplication.java
│       │   ├── config/                   # CorsConfig.java, DataInitializer.java
│       │   ├── controller/               # EventController, RegistrationController, etc.
│       │   ├── dto/                      # Request & Response DTOs
│       │   ├── entity/                   # Event, Organizer, Venue, Participant, Registration
│       │   ├── exception/                # GlobalExceptionHandler, ResourceNotFoundException, etc.
│       │   ├── repository/               # Spring Data JPA Repositories
│       │   └── service/                  # Business Logic & Validations
│       └── resources/
│           └── application.properties    # Database configuration & credentials
│
├── frontend/                             # React Application (Port 5173)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                       # Routing & Main Layout
│       ├── api/apiClient.js              # Axios REST Client
│       ├── components/                   # Navbar, AlertBanner, ConfirmModal
│       ├── pages/                        # Dashboard, Events, Registration, Venues, Organizers
│       └── index.css                     # Academic Navy & White Theme
│
├── database/                             # SQL Scripts
│   ├── 01_schema.sql                     # Table definitions & constraints
│   ├── 02_sample_data.sql                # Realistic DBIT sample records
│   └── 03_demo_queries.sql               # Queries for viva demonstration
│
└── docs/                                 # College Deliverables
    ├── DBIT_Event_Management_API.postman_collection.json # Ready-to-import Postman collection
    ├── PROJECT_REPORT.md                 # Full academic project report template
    └── VIVA_PREPARATION_GUIDE.md         # Questions & answers for viva exam
```

---

## 🚀 How to Run the Application (Step-by-Step)

### Step 1: Ensure MySQL is Running
Make sure your MySQL server is running on port `3306`.
The application is pre-configured in `backend/src/main/resources/application.properties` with:
- **Database:** `dbit_event_management`
- **Username:** `root`
- **Password:** `@123` *(or your custom password)*

*(Note: Spring Boot will automatically create the database and tables on first run, and `DataInitializer.java` will automatically seed sample DBIT records!)*

---

### Step 2: Start the Spring Boot Backend
Open a terminal in the `backend/` folder and run:

**On Windows (PowerShell or CMD):**
```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\dbit-college-event-system\backend
.\mvnw.cmd spring-boot:run
```

**On Linux / Mac:**
```bash
cd backend
./mvnw spring-boot:run
```

You should see:
```
=================================================
 DBIT College Event Management System Backend Started 
 Server Port: 8080                               
 API Base URL: http://localhost:8080/api         
=================================================
```

---

### Step 3: Start the React Frontend
Open a **second terminal** in the `frontend/` folder and run:

```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\dbit-college-event-system\frontend
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 🎯 12-Step Professor Demonstration Script

Follow these exact steps during your college demonstration:

1. **Dashboard Overview:**  
   Open `http://localhost:5173`. Show the professor the 4 live metric cards (**Total Events**, **Upcoming Events**, **Total Registrations**, **Campus Venues**) and the Category Breakdown progress bars. Explain that all statistics are computed directly from MySQL queries.

2. **Event Catalog & Filtering:**  
   Click **Events Catalog**. Filter by "Technical" or "Cultural". Search for *"Hackathon"*. Show how the interface dynamically updates.

3. **Event Detailed Breakdown:**  
   Click the **Eye (Details)** icon on any event card. Point out the linked Organizer details, Venue capacity, and the live roster of registered students.

4. **Create a New Event:**  
   Click **+ Create Event**. Fill in:
   - Name: `AI & Autonomous Agents Summit`
   - Category: `Technical`
   - Budget: `35000`
   - Date: Select an upcoming date
   - Organizer & Venue: Select from dropdowns  
   Click **Create Event** and show that the event immediately appears in the catalog and updates the dashboard count!

5. **Student Registration:**  
   Click **Student Register** in the top navigation.  
   - Select your newly created event.
   - Enter student details:
     - First Name: `Karan`
     - Last Name: `Patel`
     - College Email: `karan.patel@student.dbit.ac.in`
     - DOB: `2005-05-10`
   - Click **Submit Registration**.  
   Show the official **Digital Registration Slip** with unique Slip ID generated!

6. **Demonstrate Duplicate Registration Prevention:**  
   Without refreshing, immediately click **Submit Registration** again with the same student details for the same event.  
   Show the red warning banner:  
   *"Participant Karan Patel is already registered for this event."*  
   *(Explain to the professor: This is enforced at the Java Service layer AND by MySQL's composite unique constraint `UNIQUE (Participant_ID, Event_ID)`).*

7. **Registration Management & Safe Cancellation:**  
   Click **Registrations** in the navbar. Filter by event or search for `Karan`. Show how the enrollment appears in real time.

8. **Demonstrate Safe Deletion Protection:**  
   Go back to **Events Catalog**. Try to delete an event that already has registered students (e.g. *Hackathon DBIT 2026*).  
   Show how the system prevents accidental deletion with a clear warning:  
   *"Cannot delete event because X students are currently registered."*

9. **Venue Management with Capacity Validation:**  
   Click **Venues** in the navbar. Show campus venues, capacity limits, and how negative capacity is blocked by form and database check constraints (`CHECK (Capacity > 0)`).

10. **Organizer Management:**  
    Click **Organizers** to show faculty coordinators and student council associations.

---

## 🛠️ Common Troubleshooting

1. **Port 8080 already in use:**  
   If another application uses port 8080, open `backend/src/main/resources/application.properties` and change `server.port=8081`, then update `frontend/src/api/apiClient.js` to match.
2. **Access denied for MySQL root user:**  
   Ensure the password in `backend/src/main/resources/application.properties` matches your local MySQL password (`@123`).
3. **CORS issues:**  
   CORS is pre-configured in `backend/src/main/java/com/dbit/eventsystem/config/CorsConfig.java` to allow `http://localhost:5173` and `http://localhost:3000`.

---

## 👥 Contributors & Academic Viva Preparation
- See [`docs/VIVA_PREPARATION_GUIDE.md`](file:///C:/Users/DELL/.gemini/antigravity/scratch/dbit-college-event-system/docs/VIVA_PREPARATION_GUIDE.md) for 13 essential viva questions and model answers.
- See [`docs/PROJECT_REPORT.md`](file:///C:/Users/DELL/.gemini/antigravity/scratch/dbit-college-event-system/docs/PROJECT_REPORT.md) for the complete academic report template.
- Import [`docs/DBIT_Event_Management_API.postman_collection.json`](file:///C:/Users/DELL/.gemini/antigravity/scratch/dbit-college-event-system/docs/DBIT_Event_Management_API.postman_collection.json) into Postman to test all REST endpoints.
