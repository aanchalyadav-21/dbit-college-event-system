package com.dbit.eventsystem.service;

import com.dbit.eventsystem.dto.DashboardSummaryDTO;
import com.dbit.eventsystem.dto.EventResponseDTO;
import com.dbit.eventsystem.repository.EventRepository;
import com.dbit.eventsystem.repository.OrganizerRepository;
import com.dbit.eventsystem.repository.RegistrationRepository;
import com.dbit.eventsystem.repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final VenueRepository venueRepository;
    private final OrganizerRepository organizerRepository;
    private final EventService eventService;

    public DashboardService(EventRepository eventRepository,
                            RegistrationRepository registrationRepository,
                            VenueRepository venueRepository,
                            OrganizerRepository organizerRepository,
                            EventService eventService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.venueRepository = venueRepository;
        this.organizerRepository = organizerRepository;
        this.eventService = eventService;
    }

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countByDateGreaterThanEqual(LocalDate.now());
        long totalRegistrations = registrationRepository.count();
        long totalVenues = venueRepository.count();
        long totalOrganizers = organizerRepository.count();

        summary.setTotalEvents(totalEvents);
        summary.setUpcomingEvents(upcomingEvents);
        summary.setTotalRegistrations(totalRegistrations);
        summary.setTotalVenues(totalVenues);
        summary.setTotalOrganizers(totalOrganizers);

        // Calculate category breakdown from database
        Map<String, Long> categoryCounts = new HashMap<>();
        List<Object[]> rawCounts = eventRepository.countEventsByCategory();
        for (Object[] row : rawCounts) {
            String category = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            categoryCounts.put(category, count);
        }
        summary.setCategoryCounts(categoryCounts);

        // Fetch top upcoming events
        List<EventResponseDTO> upcomingList = eventRepository
                .findTop5ByDateGreaterThanEqualOrderByDateAsc(LocalDate.now())
                .stream()
                .map(eventService::mapToResponseDTO)
                .collect(Collectors.toList());
        summary.setRecentUpcomingEvents(upcomingList);

        return summary;
    }
}
