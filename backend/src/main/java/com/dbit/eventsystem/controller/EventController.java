package com.dbit.eventsystem.controller;

import com.dbit.eventsystem.dto.ApiResponse;
import com.dbit.eventsystem.dto.EventRequestDTO;
import com.dbit.eventsystem.dto.EventResponseDTO;
import com.dbit.eventsystem.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * EventController - Exposes REST API endpoints for Event Management.
 * Base URL: http://localhost:8080/api/events
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // 1. GET /api/events - Retrieve all events (supports ?search= and ?category= filters)
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getAllEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<EventResponseDTO> events = eventService.getAllEvents(search, category);
        return ResponseEntity.ok(ApiResponse.success("Events fetched successfully", events));
    }

    // 2. GET /api/events/{id} - Retrieve details for a single event
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> getEventById(@PathVariable Long id) {
        EventResponseDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Event details retrieved", event));
    }

    // 3. POST /api/events - Create a new event with validation
    @PostMapping
    public ResponseEntity<ApiResponse<EventResponseDTO>> createEvent(@Valid @RequestBody EventRequestDTO request) {
        EventResponseDTO created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", created));
    }

    // 4. PUT /api/events/{id} - Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequestDTO request) {
        EventResponseDTO updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }

    // 5. DELETE /api/events/{id} - Safe delete (blocked if students are registered)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
