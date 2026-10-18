package com.dbit.eventsystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Organizer")
public class Organizer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Organizer_ID")
    private Long organizerId;

    @NotBlank(message = "Organizer name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Organizer email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    @Column(name = "Email", nullable = false, unique = true, length = 150)
    private String email;

    public Organizer() {
    }

    public Organizer(Long organizerId, String name, String email) {
        this.organizerId = organizerId;
        this.name = name;
        this.email = email;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
