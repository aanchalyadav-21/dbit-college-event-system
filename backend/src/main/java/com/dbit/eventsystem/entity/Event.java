package com.dbit.eventsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Event_ID")
    private Long eventId;

    @NotBlank(message = "Event name is required")
    @Size(max = 150, message = "Event name cannot exceed 150 characters")
    @Column(name = "Event_Name", nullable = false, length = 150)
    private String eventName;

    @NotBlank(message = "Event description is required")
    @Lob
    @Column(name = "Description", nullable = false)
    private String description;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    @Column(name = "Category", nullable = false, length = 50)
    private String category;

    @NotNull(message = "Event date is required")
    @Column(name = "Date", nullable = false)
    private LocalDate date;

    @NotNull(message = "Event time is required")
    @Column(name = "Time", nullable = false)
    private LocalTime time;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Budget cannot be negative")
    @Column(name = "Budget", nullable = false, precision = 10, scale = 2)
    private BigDecimal budget;

    @NotNull(message = "Organizer is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Organizer_ID", nullable = false)
    private Organizer organizer;

    @NotNull(message = "Venue is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Venue_ID", nullable = false)
    private Venue venue;

    public Event() {
    }

    public Event(Long eventId, String eventName, String description, String category,
                 LocalDate date, LocalTime time, BigDecimal budget, Organizer organizer, Venue venue) {
        this.eventId = eventId;
        this.eventName = eventName;
        this.description = description;
        this.category = category;
        this.date = date;
        this.time = time;
        this.budget = budget;
        this.organizer = organizer;
        this.venue = venue;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public Organizer getOrganizer() {
        return organizer;
    }

    public void setOrganizer(Organizer organizer) {
        this.organizer = organizer;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }
}
