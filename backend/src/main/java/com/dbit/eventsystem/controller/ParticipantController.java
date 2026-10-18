package com.dbit.eventsystem.controller;

import com.dbit.eventsystem.dto.ApiResponse;
import com.dbit.eventsystem.entity.Participant;
import com.dbit.eventsystem.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Participant>>> getAllParticipants() {
        List<Participant> list = participantService.getAllParticipants();
        return ResponseEntity.ok(ApiResponse.success("Participants fetched successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Participant>> getParticipantById(@PathVariable Long id) {
        Participant participant = participantService.getParticipantById(id);
        return ResponseEntity.ok(ApiResponse.success("Participant details retrieved", participant));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Participant>> createParticipant(@Valid @RequestBody Participant participant) {
        Participant created = participantService.createParticipant(participant);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Participant registered successfully", created));
    }
}
