-- =====================================================================
-- College Event Management System (DBIT) - Database Schema
-- Database: dbit_event_management
-- =====================================================================

CREATE DATABASE IF NOT EXISTS dbit_event_management;
USE dbit_event_management;

-- Drop existing tables in reverse dependency order to prevent FK errors
DROP TABLE IF EXISTS Registration;
DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Participant;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Organizer;

-- 1. Organizer Table
CREATE TABLE Organizer (
    Organizer_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Venue Table
CREATE TABLE Venue (
    Venue_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Capacity INT NOT NULL,
    Area VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Landmark VARCHAR(150),
    CONSTRAINT chk_venue_capacity CHECK (Capacity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Participant Table
CREATE TABLE Participant (
    Participant_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Event Table
CREATE TABLE Event (
    Event_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Event_Name VARCHAR(150) NOT NULL,
    Description TEXT NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Budget DECIMAL(10, 2) NOT NULL,
    Organizer_ID BIGINT NOT NULL,
    Venue_ID BIGINT NOT NULL,
    CONSTRAINT chk_event_budget CHECK (Budget >= 0),
    CONSTRAINT fk_event_organizer FOREIGN KEY (Organizer_ID) REFERENCES Organizer (Organizer_ID) ON DELETE RESTRICT,
    CONSTRAINT fk_event_venue FOREIGN KEY (Venue_ID) REFERENCES Venue (Venue_ID) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Registration Table
CREATE TABLE Registration (
    Registration_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Participant_ID BIGINT NOT NULL,
    Event_ID BIGINT NOT NULL,
    Registration_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reg_participant FOREIGN KEY (Participant_ID) REFERENCES Participant (Participant_ID) ON DELETE CASCADE,
    CONSTRAINT fk_reg_event FOREIGN KEY (Event_ID) REFERENCES Event (Event_ID) ON DELETE RESTRICT,
    -- Enforce duplicate registration prevention at database level
    CONSTRAINT uq_participant_event UNIQUE (Participant_ID, Event_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for search and foreign key join performance
CREATE INDEX idx_event_category ON Event(Category);
CREATE INDEX idx_event_date ON Event(Date);
CREATE INDEX idx_reg_event ON Registration(Event_ID);
CREATE INDEX idx_reg_participant ON Registration(Participant_ID);
