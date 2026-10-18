package com.dbit.eventsystem.service;

import com.dbit.eventsystem.dto.RegistrationRequestDTO;
import com.dbit.eventsystem.dto.RegistrationResponseDTO;
import com.dbit.eventsystem.entity.Event;
import com.dbit.eventsystem.entity.Participant;
import com.dbit.eventsystem.entity.Registration;
import com.dbit.eventsystem.exception.BadRequestException;
import com.dbit.eventsystem.exception.DuplicateResourceException;
import com.dbit.eventsystem.exception.ResourceNotFoundException;
import com.dbit.eventsystem.repository.EventRepository;
import com.dbit.eventsystem.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * RegistrationService - Handles all business logic for student registrations.
 * Demonstrates:
 * 1. Venue capacity verification before accepting registration.
 * 2. Duplicate registration prevention (application-level guard).
 * 3. Safe cancellation of registrations.
 */
@Service
@Transactional
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final ParticipantService participantService;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               ParticipantService participantService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.participantService = participantService;
    }

    /**
     * Registers a student for a specific event.
     * Enforces capacity limits and prevents duplicate registrations.
     */
    public RegistrationResponseDTO registerStudent(RegistrationRequestDTO dto) {
        // Step 1: Verify the event exists in the database
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + dto.getEventId()));

        // Step 2: Check venue seating capacity limit
        if (event.getVenue() != null && event.getVenue().getCapacity() != null) {
            long currentCount = registrationRepository.countByEvent_EventId(event.getEventId());
            if (currentCount >= event.getVenue().getCapacity()) {
                throw new BadRequestException("Registration closed: Venue '" +
                        event.getVenue().getName() + "' has reached its maximum capacity of " +
                        event.getVenue().getCapacity() + " attendees.");
            }
        }

        // Step 3: Find existing participant by email or register them as a new participant
        Participant participant = participantService.findOrCreateParticipant(
                dto.getFirstName().trim(),
                dto.getLastName().trim(),
                dto.getDob(),
                dto.getEmail().trim().toLowerCase()
        );

        // Step 4: Enforce duplicate registration prevention at application layer
        // (Also permanently backed up by MySQL's UNIQUE(Participant_ID, Event_ID) constraint)
        boolean alreadyRegistered = registrationRepository.existsByParticipant_ParticipantIdAndEvent_EventId(
                participant.getParticipantId(),
                event.getEventId()
        );

        if (alreadyRegistered) {
            throw new DuplicateResourceException("Participant '" + participant.getFirstName() + " " +
                    participant.getLastName() + "' (" + participant.getEmail() + ") is already registered for '" +
                    event.getEventName() + "'.");
        }

        // Step 5: Save new registration record to MySQL
        Registration registration = new Registration();
        registration.setParticipant(participant);
        registration.setEvent(event);

        Registration saved = registrationRepository.save(registration);
        return mapToDTO(saved);
    }

    /**
     * Retrieves all registrations with student and event details.
     */
    @Transactional(readOnly = true)
    public List<RegistrationResponseDTO> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all registrations for a specific event.
     */
    @Transactional(readOnly = true)
    public List<RegistrationResponseDTO> getRegistrationsByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with ID: " + eventId);
        }
        return registrationRepository.findByEvent_EventId(eventId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Safely cancels a student registration by registration ID.
     */
    public void cancelRegistration(Long id) {
        Registration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + id));
        registrationRepository.delete(reg);
    }

    /**
     * Helper method to map Registration entity into RegistrationResponseDTO.
     * Prevents circular JSON reference issues.
     */
    private RegistrationResponseDTO mapToDTO(Registration reg) {
        RegistrationResponseDTO dto = new RegistrationResponseDTO();
        dto.setRegistrationId(reg.getRegistrationId());
        dto.setRegistrationDate(reg.getRegistrationDate());

        if (reg.getParticipant() != null) {
            dto.setParticipantId(reg.getParticipant().getParticipantId());
            dto.setParticipantName(reg.getParticipant().getFirstName() + " " + reg.getParticipant().getLastName());
            dto.setParticipantEmail(reg.getParticipant().getEmail());
            dto.setParticipantDob(reg.getParticipant().getDob());
        }

        if (reg.getEvent() != null) {
            dto.setEventId(reg.getEvent().getEventId());
            dto.setEventName(reg.getEvent().getEventName());
            dto.setEventCategory(reg.getEvent().getCategory());
            dto.setEventDate(reg.getEvent().getDate());
            dto.setEventTime(reg.getEvent().getTime());
            if (reg.getEvent().getVenue() != null) {
                dto.setVenueName(reg.getEvent().getVenue().getName());
            }
        }

        return dto;
    }
}
