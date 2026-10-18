-- =====================================================================
-- College Event Management System (DBIT) - Sample Data
-- Database: dbit_event_management
-- =====================================================================

USE dbit_event_management;

-- 1. Insert Sample Organizers
INSERT INTO Organizer (Name, Email) VALUES
('Prof. Snehal Shinde (HOD Comp)', 'snehal.shinde@dbit.ac.in'),
('Prof. Imran Patel (Faculty Coordinator)', 'imran.patel@dbit.ac.in'),
('CSI Student Council - DBIT', 'csi.council@dbit.ac.in'),
('IEEE Student Branch DBIT', 'ieee.dbit@dbit.ac.in'),
('Sports Committee DBIT', 'sports.council@dbit.ac.in'),
('Cultural Association (Colosseum)', 'colosseum@dbit.ac.in');

-- 2. Insert Sample Venues
INSERT INTO Venue (Name, Capacity, Area, City, Landmark) VALUES
('Mazzarello Multipurpose Hall', 350, 'Engineering Block A, 1st Floor', 'Mumbai', 'Near Main College Reception'),
('Seminar Hall B', 120, 'Engineering Block B, 3rd Floor', 'Mumbai', 'Opposite Computer Lab 304'),
('Advanced Computing Lab 1', 60, 'Wing C, 2nd Floor', 'Mumbai', 'Next to Server Room'),
('DBIT Football Ground', 500, 'Campus Outdoor Area', 'Mumbai', 'Behind Mechanical Workshop'),
('Auditorium 3rd Floor', 250, 'Main Building, 3rd Floor', 'Mumbai', 'Near Library Entrance');

-- 3. Insert Sample Participants (Students)
INSERT INTO Participant (First_Name, Last_Name, DOB, Email) VALUES
('Aarav', 'Mehta', '2005-04-12', 'aarav.mehta@student.dbit.ac.in'),
('Diya', 'Sharma', '2005-08-23', 'diya.sharma@student.dbit.ac.in'),
('Rohan', 'Deshmukh', '2004-11-05', 'rohan.deshmukh@student.dbit.ac.in'),
('Ananya', 'Iyer', '2005-02-18', 'ananya.iyer@student.dbit.ac.in'),
('Sahil', 'Khan', '2004-09-30', 'sahil.khan@student.dbit.ac.in'),
('Tanvi', 'Patil', '2005-06-14', 'tanvi.patil@student.dbit.ac.in'),
('Vedant', 'Kulkarni', '2004-12-01', 'vedant.kulkarni@student.dbit.ac.in'),
('Pooja', 'Nair', '2005-03-27', 'pooja.nair@student.dbit.ac.in');

-- 4. Insert Sample Events (Upcoming and Recent)
INSERT INTO Event (Event_Name, Description, Category, Date, Time, Budget, Organizer_ID, Venue_ID) VALUES
('Hackathon DBIT 2026', '24-hour inter-college software hackathon focusing on AI, Web3, and Smart Campus solutions.', 'Technical', '2026-11-15', '09:00:00', 45000.00, 3, 1),
('Cloud & DevOps Hands-on Workshop', 'Interactive masterclass on Docker, Kubernetes, and CI/CD pipelines with industry experts.', 'Workshop', '2026-11-20', '10:30:00', 15000.00, 4, 3),
('Colosseum 2026 - Annual Cultural Fest', 'Grand inter-college festival featuring dance, music, drama, fashion show, and celebrity night.', 'Cultural', '2026-12-05', '16:00:00', 120000.00, 6, 1),
('DBIT Inter-Department Cricket Trophy', 'Annual tennis-ball cricket tournament between Computer, IT, Mech, and EXTC branches.', 'Sports', '2026-11-28', '08:00:00', 25000.00, 5, 4),
('Guest Lecture: Career in Cyber Security', 'Industry insights by senior penetration testers on ethical hacking, bug bounty, and certifications.', 'Seminar', '2026-10-25', '11:00:00', 8000.00, 1, 2),
('Web Development Bootcamp with React', 'Beginner to intermediate session on building modern full-stack web applications with React & Spring Boot.', 'Workshop', '2026-11-02', '13:00:00', 12000.00, 2, 3);

-- 5. Insert Sample Registrations
INSERT INTO Registration (Participant_ID, Event_ID, Registration_Date) VALUES
(1, 1, '2026-10-10 10:15:00'),
(2, 1, '2026-10-10 11:30:00'),
(3, 1, '2026-10-11 09:45:00'),
(4, 2, '2026-10-12 14:20:00'),
(5, 2, '2026-10-12 16:10:00'),
(1, 3, '2026-10-13 18:05:00'),
(6, 3, '2026-10-14 12:00:00'),
(7, 4, '2026-10-14 15:30:00'),
(8, 5, '2026-10-15 09:10:00'),
(2, 6, '2026-10-15 11:00:00');
