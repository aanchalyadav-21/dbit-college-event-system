package com.dbit.eventsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Venue")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Venue_ID")
    private Long venueId;

    @NotBlank(message = "Venue name is required")
    @Size(max = 100, message = "Venue name cannot exceed 100 characters")
    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than zero")
    @Column(name = "Capacity", nullable = false)
    private Integer capacity;

    @NotBlank(message = "Area is required")
    @Size(max = 100, message = "Area cannot exceed 100 characters")
    @Column(name = "Area", nullable = false, length = 100)
    private String area;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    @Column(name = "City", nullable = false, length = 100)
    private String city;

    @Size(max = 150, message = "Landmark cannot exceed 150 characters")
    @Column(name = "Landmark", length = 150)
    private String landmark;

    public Venue() {
    }

    public Venue(Long venueId, String name, Integer capacity, String area, String city, String landmark) {
        this.venueId = venueId;
        this.name = name;
        this.capacity = capacity;
        this.area = area;
        this.city = city;
        this.landmark = landmark;
    }

    public Long getVenueId() {
        return venueId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }
}
