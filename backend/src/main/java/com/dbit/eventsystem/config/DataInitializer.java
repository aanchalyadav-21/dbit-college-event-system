package com.dbit.eventsystem.config;

import com.dbit.eventsystem.entity.Event;
import com.dbit.eventsystem.entity.Organizer;
import com.dbit.eventsystem.entity.Participant;
import com.dbit.eventsystem.entity.Registration;
import com.dbit.eventsystem.entity.Venue;
import com.dbit.eventsystem.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Automatically seeds initial DBIT sample records on first startup
 * if the database is currently empty.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final OrganizerRepository organizerRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;
    private final RegistrationRepository registrationRepository;

    public DataInitializer(OrganizerRepository organizerRepository,
                           VenueRepository venueRepository,
                           EventRepository eventRepository,
                           ParticipantRepository participantRepository,
                           RegistrationRepository registrationRepository) {
        this.organizerRepository = organizerRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.registrationRepository = registrationRepository;
    }

    @Override
    public void run(String... args) {
        if (organizerRepository.count() > 0) {
            System.out.println("[DBIT System] Database already populated with records.");
            return;
        }

        System.out.println("[DBIT System] Initializing realistic DBIT sample data into MySQL...");

        // 1. Organizers
        Organizer org1 = organizerRepository.save(new Organizer(null, "Prof. Snehal Shinde (HOD Comp)", "snehal.shinde@dbit.ac.in"));
        Organizer org2 = organizerRepository.save(new Organizer(null, "Prof. Imran Patel (Faculty Coordinator)", "imran.patel@dbit.ac.in"));
        Organizer org3 = organizerRepository.save(new Organizer(null, "CSI Student Council - DBIT", "csi.council@dbit.ac.in"));
        Organizer org4 = organizerRepository.save(new Organizer(null, "IEEE Student Branch DBIT", "ieee.dbit@dbit.ac.in"));
        Organizer org5 = organizerRepository.save(new Organizer(null, "Sports Committee DBIT", "sports.council@dbit.ac.in"));
        Organizer org6 = organizerRepository.save(new Organizer(null, "Cultural Association (Colosseum)", "colosseum@dbit.ac.in"));

        // 2. Venues
        Venue ven1 = venueRepository.save(new Venue(null, "Mazzarello Multipurpose Hall", 350, "Engineering Block A, 1st Floor", "Mumbai", "Near Main Reception"));
        Venue ven2 = venueRepository.save(new Venue(null, "Seminar Hall B", 120, "Engineering Block B, 3rd Floor", "Mumbai", "Opposite Computer Lab 304"));
        Venue ven3 = venueRepository.save(new Venue(null, "Advanced Computing Lab 1", 60, "Wing C, 2nd Floor", "Mumbai", "Next to Server Room"));
        Venue ven4 = venueRepository.save(new Venue(null, "DBIT Football Ground", 500, "Campus Outdoor Area", "Mumbai", "Behind Workshop"));
        Venue ven5 = venueRepository.save(new Venue(null, "Auditorium 3rd Floor", 250, "Main Building, 3rd Floor", "Mumbai", "Near Library Entrance"));

        // 3. Participants (Students)
        Participant p1 = participantRepository.save(new Participant(null, "Aarav", "Mehta", LocalDate.of(2005, 4, 12), "aarav.mehta@student.dbit.ac.in"));
        Participant p2 = participantRepository.save(new Participant(null, "Diya", "Sharma", LocalDate.of(2005, 8, 23), "diya.sharma@student.dbit.ac.in"));
        Participant p3 = participantRepository.save(new Participant(null, "Rohan", "Deshmukh", LocalDate.of(2004, 11, 5), "rohan.deshmukh@student.dbit.ac.in"));
        Participant p4 = participantRepository.save(new Participant(null, "Ananya", "Iyer", LocalDate.of(2005, 2, 18), "ananya.iyer@student.dbit.ac.in"));
        Participant p5 = participantRepository.save(new Participant(null, "Sahil", "Khan", LocalDate.of(2004, 9, 30), "sahil.khan@student.dbit.ac.in"));
        Participant p6 = participantRepository.save(new Participant(null, "Tanvi", "Patil", LocalDate.of(2005, 6, 14), "tanvi.patil@student.dbit.ac.in"));

        // 4. Events
        Event e1 = eventRepository.save(new Event(null, "Hackathon DBIT 2026",
                "24-hour inter-college software hackathon focusing on AI, Web3, and Smart Campus solutions.",
                "Technical", LocalDate.now().plusDays(20), LocalTime.of(9, 0), new BigDecimal("45000.00"), org3, ven1));

        Event e2 = eventRepository.save(new Event(null, "Cloud & DevOps Hands-on Workshop",
                "Interactive masterclass on Docker, Kubernetes, and CI/CD pipelines with industry experts.",
                "Workshop", LocalDate.now().plusDays(15), LocalTime.of(10, 30), new BigDecimal("15000.00"), org4, ven3));

        Event e3 = eventRepository.save(new Event(null, "Colosseum 2026 - Annual Cultural Fest",
                "Grand inter-college festival featuring dance, music, drama, fashion show, and celebrity night.",
                "Cultural", LocalDate.now().plusDays(40), LocalTime.of(16, 0), new BigDecimal("120000.00"), org6, ven1));

        Event e4 = eventRepository.save(new Event(null, "DBIT Inter-Department Cricket Trophy",
                "Annual tennis-ball cricket tournament between Computer, IT, Mech, and EXTC branches.",
                "Sports", LocalDate.now().plusDays(25), LocalTime.of(8, 0), new BigDecimal("25000.00"), org5, ven4));

        Event e5 = eventRepository.save(new Event(null, "Guest Lecture: Career in Cyber Security",
                "Industry insights by senior penetration testers on ethical hacking and certifications.",
                "Seminar", LocalDate.now().plusDays(7), LocalTime.of(11, 0), new BigDecimal("8000.00"), org1, ven2));

        // 5. Registrations
        registrationRepository.save(new Registration(null, p1, e1, LocalDateTime.now().minusDays(2)));
        registrationRepository.save(new Registration(null, p2, e1, LocalDateTime.now().minusDays(2)));
        registrationRepository.save(new Registration(null, p3, e1, LocalDateTime.now().minusDays(1)));
        registrationRepository.save(new Registration(null, p4, e2, LocalDateTime.now().minusDays(1)));
        registrationRepository.save(new Registration(null, p5, e2, LocalDateTime.now().minusHours(12)));
        registrationRepository.save(new Registration(null, p1, e3, LocalDateTime.now().minusHours(6)));
        registrationRepository.save(new Registration(null, p6, e3, LocalDateTime.now().minusHours(4)));

        System.out.println("[DBIT System] Initial DBIT sample data seeded successfully.");
    }
}
