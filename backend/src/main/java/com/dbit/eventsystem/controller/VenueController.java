package com.dbit.eventsystem.controller;

import com.dbit.eventsystem.dto.ApiResponse;
import com.dbit.eventsystem.entity.Venue;
import com.dbit.eventsystem.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Venue>>> getAllVenues() {
        List<Venue> list = venueService.getAllVenues();
        return ResponseEntity.ok(ApiResponse.success("Venues fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Venue>> getVenueById(@PathVariable Long id) {
        Venue venue = venueService.getVenueById(id);
        return ResponseEntity.ok(ApiResponse.success("Venue details retrieved", venue));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Venue>> createVenue(@Valid @RequestBody Venue venue) {
        Venue created = venueService.createVenue(venue);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Venue created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Venue>> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody Venue venue) {
        Venue updated = venueService.updateVenue(id, venue);
        return ResponseEntity.ok(ApiResponse.success("Venue updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.success("Venue deleted successfully", null));
    }
}
