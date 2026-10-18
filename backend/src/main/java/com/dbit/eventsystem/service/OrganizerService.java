package com.dbit.eventsystem.service;

import com.dbit.eventsystem.entity.Organizer;
import com.dbit.eventsystem.exception.BadRequestException;
import com.dbit.eventsystem.exception.DuplicateResourceException;
import com.dbit.eventsystem.exception.ResourceNotFoundException;
import com.dbit.eventsystem.repository.EventRepository;
import com.dbit.eventsystem.repository.OrganizerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrganizerService {

    private final OrganizerRepository organizerRepository;
    private final EventRepository eventRepository;

    public OrganizerService(OrganizerRepository organizerRepository, EventRepository eventRepository) {
        this.organizerRepository = organizerRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<Organizer> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Organizer getOrganizerById(Long id) {
        return organizerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found with ID: " + id));
    }

    public Organizer createOrganizer(Organizer organizer) {
        if (organizerRepository.existsByEmail(organizer.getEmail())) {
            throw new DuplicateResourceException("An organizer with email " + organizer.getEmail() + " already exists.");
        }
        return organizerRepository.save(organizer);
    }

    public Organizer updateOrganizer(Long id, Organizer updated) {
        Organizer existing = getOrganizerById(id);

        if (!existing.getEmail().equalsIgnoreCase(updated.getEmail()) &&
                organizerRepository.existsByEmail(updated.getEmail())) {
            throw new DuplicateResourceException("An organizer with email " + updated.getEmail() + " already exists.");
        }

        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        return organizerRepository.save(existing);
    }

    public void deleteOrganizer(Long id) {
        Organizer organizer = getOrganizerById(id);
        long linkedEvents = eventRepository.countByOrganizer_OrganizerId(id);
        if (linkedEvents > 0) {
            throw new BadRequestException("Cannot delete organizer '" + organizer.getName() + "' because " +
                    linkedEvents + " event(s) are assigned to them.");
        }
        organizerRepository.delete(organizer);
    }
}
