package com.dbit.eventsystem.service;

import com.dbit.eventsystem.entity.Venue;
import com.dbit.eventsystem.exception.BadRequestException;
import com.dbit.eventsystem.exception.ResourceNotFoundException;
import com.dbit.eventsystem.repository.EventRepository;
import com.dbit.eventsystem.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VenueService {

    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;

    public VenueService(VenueRepository venueRepository, EventRepository eventRepository) {
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
    }

    public Venue createVenue(Venue venue) {
        if (venue.getCapacity() == null || venue.getCapacity() <= 0) {
            throw new BadRequestException("Venue capacity must be greater than zero.");
        }
        return venueRepository.save(venue);
    }

    public Venue updateVenue(Long id, Venue updated) {
        Venue existing = getVenueById(id);
        if (updated.getCapacity() == null || updated.getCapacity() <= 0) {
            throw new BadRequestException("Venue capacity must be greater than zero.");
        }
        existing.setName(updated.getName());
        existing.setCapacity(updated.getCapacity());
        existing.setArea(updated.getArea());
        existing.setCity(updated.getCity());
        existing.setLandmark(updated.getLandmark());
        return venueRepository.save(existing);
    }

    public void deleteVenue(Long id) {
        Venue venue = getVenueById(id);
        long linkedEvents = eventRepository.countByVenue_VenueId(id);
        if (linkedEvents > 0) {
            throw new BadRequestException("Cannot delete venue '" + venue.getName() + "' because " +
                    linkedEvents + " event(s) are booked here.");
        }
        venueRepository.delete(venue);
    }
}
