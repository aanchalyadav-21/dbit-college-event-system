package com.dbit.eventsystem.service;

import com.dbit.eventsystem.dto.EventRequestDTO;
import com.dbit.eventsystem.dto.EventResponseDTO;
import com.dbit.eventsystem.entity.Event;
import com.dbit.eventsystem.entity.Organizer;
import com.dbit.eventsystem.entity.Venue;
import com.dbit.eventsystem.exception.BadRequestException;
import com.dbit.eventsystem.exception.ResourceNotFoundException;
import com.dbit.eventsystem.repository.EventRepository;
import com.dbit.eventsystem.repository.OrganizerRepository;
import com.dbit.eventsystem.repository.RegistrationRepository;
import com.dbit.eventsystem.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EventService - Handles all business logic for college events.
 * Demonstrates:
 * 1. Filtering events by keyword search and category.
 * 2. Safe event creation and updates with foreign key resolution.
 * 3. Safe deletion check (blocks delete if students are registered).
 */
@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizerRepository organizerRepository;
    private final VenueRepository venueRepository;
    private final RegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository,
                        OrganizerRepository organizerRepository,
                        VenueRepository venueRepository,
                        RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.organizerRepository = organizerRepository;
        this.venueRepository = venueRepository;
        this.registrationRepository = registrationRepository;
    }

    /**
     * Retrieves all events, with optional keyword search and category filter.
     */
    @Transactional(readOnly = true)
    public List<EventResponseDTO> getAllEvents(String search, String category) {
        List<Event> events;
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasCategory = category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All");

        if (hasSearch && hasCategory) {
            events = eventRepository.findByEventNameContainingIgnoreCaseAndCategoryIgnoreCase(search.trim(), category.trim());
        } else if (hasSearch) {
            events = eventRepository.findByEventNameContainingIgnoreCase(search.trim());
        } else if (hasCategory) {
            events = eventRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            events = eventRepository.findAll();
        }

        return events.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    /**
     * Looks up an Event entity by its primary key ID.
     */
    @Transactional(readOnly = true)
    public Event getEventEntityById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
    }

    /**
     * Retrieves an event response DTO with calculated registration count.
     */
    @Transactional(readOnly = true)
    public EventResponseDTO getEventById(Long id) {
        Event event = getEventEntityById(id);
        return mapToResponseDTO(event);
    }

    /**
     * Creates a new event after verifying foreign keys for Organizer and Venue.
     */
    public EventResponseDTO createEvent(EventRequestDTO dto) {
        validateEventRequest(dto);

        Organizer organizer = organizerRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with ID: " + dto.getOrganizerId()));

        Venue venue = venueRepository.findById(dto.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + dto.getVenueId()));

        Event event = new Event();
        event.setEventName(dto.getEventName().trim());
        event.setDescription(dto.getDescription().trim());
        event.setCategory(dto.getCategory().trim());
        event.setDate(dto.getDate());
        event.setTime(dto.getTime());
        event.setBudget(dto.getBudget());
        event.setOrganizer(organizer);
        event.setVenue(venue);

        Event saved = eventRepository.save(event);
        return mapToResponseDTO(saved);
    }

    /**
     * Updates an existing event details.
     */
    public EventResponseDTO updateEvent(Long id, EventRequestDTO dto) {
        validateEventRequest(dto);

        Event existing = getEventEntityById(id);

        Organizer organizer = organizerRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with ID: " + dto.getOrganizerId()));

        Venue venue = venueRepository.findById(dto.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + dto.getVenueId()));

        existing.setEventName(dto.getEventName().trim());
        existing.setDescription(dto.getDescription().trim());
        existing.setCategory(dto.getCategory().trim());
        existing.setDate(dto.getDate());
        existing.setTime(dto.getTime());
        existing.setBudget(dto.getBudget());
        existing.setOrganizer(organizer);
        existing.setVenue(venue);

        Event updated = eventRepository.save(existing);
        return mapToResponseDTO(updated);
    }

    /**
     * Safe delete: checks if any student registrations exist.
     * Prevents orphan records and displays a clean error message.
     */
    public void deleteEvent(Long id) {
        Event event = getEventEntityById(id);
        long regCount = registrationRepository.countByEvent_EventId(id);
        if (regCount > 0) {
            throw new BadRequestException("Cannot delete event '" + event.getEventName() +
                    "' because " + regCount + " student(s) are currently registered for it. Please manage registrations first.");
        }
        eventRepository.delete(event);
    }

    /**
     * Validates business rules for event budget.
     */
    private void validateEventRequest(EventRequestDTO dto) {
        if (dto.getBudget() != null && dto.getBudget().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Event budget cannot be negative.");
        }
    }

    /**
     * Helper method to map Event entity into EventResponseDTO.
     * Calculates registration count and upcoming status.
     */
    public EventResponseDTO mapToResponseDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setEventId(event.getEventId());
        dto.setEventName(event.getEventName());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setDate(event.getDate());
        dto.setTime(event.getTime());
        dto.setBudget(event.getBudget());

        if (event.getOrganizer() != null) {
            dto.setOrganizerId(event.getOrganizer().getOrganizerId());
            dto.setOrganizerName(event.getOrganizer().getName());
            dto.setOrganizerEmail(event.getOrganizer().getEmail());
        }

        if (event.getVenue() != null) {
            dto.setVenueId(event.getVenue().getVenueId());
            dto.setVenueName(event.getVenue().getName());
            dto.setVenueCapacity(event.getVenue().getCapacity());
            dto.setVenueArea(event.getVenue().getArea());
            dto.setVenueCity(event.getVenue().getCity());
            dto.setVenueLandmark(event.getVenue().getLandmark());
        }

        long count = registrationRepository.countByEvent_EventId(event.getEventId());
        dto.setRegistrationCount(count);
        dto.setUpcoming(!event.getDate().isBefore(LocalDate.now()));

        return dto;
    }
}
