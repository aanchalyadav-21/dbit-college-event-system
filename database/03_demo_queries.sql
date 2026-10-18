-- =====================================================================
-- College Event Management System (DBIT) - Viva & Demo Queries
-- Use these in MySQL Workbench or terminal to demonstrate database logic
-- =====================================================================

USE dbit_event_management;

-- 1. View all events with organizer name and venue details (Relational JOIN)
SELECT 
    e.Event_ID,
    e.Event_Name,
    e.Category,
    e.Date,
    e.Time,
    e.Budget,
    o.Name AS Organizer_Name,
    v.Name AS Venue_Name,
    v.Capacity AS Venue_Capacity
FROM Event e
INNER JOIN Organizer o ON e.Organizer_ID = o.Organizer_ID
INNER JOIN Venue v ON e.Venue_ID = v.Venue_ID
ORDER BY e.Date ASC;

-- 2. Count total registrations per event (Aggregations)
SELECT 
    e.Event_ID,
    e.Event_Name,
    e.Category,
    COUNT(r.Registration_ID) AS Total_Registered_Students,
    v.Capacity AS Max_Capacity
FROM Event e
LEFT JOIN Registration r ON e.Event_ID = r.Event_ID
LEFT JOIN Venue v ON e.Venue_ID = v.Venue_ID
GROUP BY e.Event_ID, e.Event_Name, e.Category, v.Capacity;

-- 3. Category-wise event breakdown for Dashboard
SELECT 
    Category,
    COUNT(*) AS Total_Events,
    SUM(Budget) AS Total_Budget
FROM Event
GROUP BY Category;

-- 4. List all students registered for 'Hackathon DBIT 2026'
SELECT 
    p.Participant_ID,
    CONCAT(p.First_Name, ' ', p.Last_Name) AS Student_Name,
    p.Email,
    p.DOB,
    r.Registration_Date
FROM Registration r
INNER JOIN Participant p ON r.Participant_ID = p.Participant_ID
INNER JOIN Event e ON r.Event_ID = e.Event_ID
WHERE e.Event_Name = 'Hackathon DBIT 2026'
ORDER BY r.Registration_Date ASC;

-- 5. Demonstrate Duplicate Registration Constraint test
-- (This should FAIL with MySQL Error 1062 - Duplicate entry)
-- INSERT INTO Registration (Participant_ID, Event_ID) VALUES (1, 1);
