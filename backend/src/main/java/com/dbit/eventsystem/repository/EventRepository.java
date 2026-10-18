package com.dbit.eventsystem.repository;

import com.dbit.eventsystem.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventNameContainingIgnoreCase(String name);

    List<Event> findByCategoryIgnoreCase(String category);

    List<Event> findByEventNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category);

    List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);

    List<Event> findTop5ByDateGreaterThanEqualOrderByDateAsc(LocalDate date);

    long countByDateGreaterThanEqual(LocalDate date);

    long countByOrganizer_OrganizerId(Long organizerId);

    long countByVenue_VenueId(Long venueId);

    @Query("SELECT e.category, COUNT(e) FROM Event e GROUP BY e.category")
    List<Object[]> countEventsByCategory();
}
