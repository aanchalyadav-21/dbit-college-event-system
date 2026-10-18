package com.dbit.eventsystem.controller;

import com.dbit.eventsystem.dto.ApiResponse;
import com.dbit.eventsystem.entity.Organizer;
import com.dbit.eventsystem.service.OrganizerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizers")
public class OrganizerController {

    private final OrganizerService organizerService;

    public OrganizerController(OrganizerService organizerService) {
        this.organizerService = organizerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Organizer>>> getAllOrganizers() {
        List<Organizer> list = organizerService.getAllOrganizers();
        return ResponseEntity.ok(ApiResponse.success("Organizers fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Organizer>> getOrganizerById(@PathVariable Long id) {
        Organizer organizer = organizerService.getOrganizerById(id);
        return ResponseEntity.ok(ApiResponse.success("Organizer details retrieved", organizer));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Organizer>> createOrganizer(@Valid @RequestBody Organizer organizer) {
        Organizer created = organizerService.createOrganizer(organizer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organizer created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Organizer>> updateOrganizer(
            @PathVariable Long id,
            @Valid @RequestBody Organizer organizer) {
        Organizer updated = organizerService.updateOrganizer(id, organizer);
        return ResponseEntity.ok(ApiResponse.success("Organizer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrganizer(@PathVariable Long id) {
        organizerService.deleteOrganizer(id);
        return ResponseEntity.ok(ApiResponse.success("Organizer deleted successfully", null));
    }
}
