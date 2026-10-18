package com.dbit.eventsystem.controller;

import com.dbit.eventsystem.dto.ApiResponse;
import com.dbit.eventsystem.dto.RegistrationRequestDTO;
import com.dbit.eventsystem.dto.RegistrationResponseDTO;
import com.dbit.eventsystem.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponseDTO>> registerStudent(
            @Valid @RequestBody RegistrationRequestDTO request) {
        RegistrationResponseDTO response = registrationService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful! You are confirmed for this event.", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RegistrationResponseDTO>>> getAllRegistrations() {
        List<RegistrationResponseDTO> list = registrationService.getAllRegistrations();
        return ResponseEntity.ok(ApiResponse.success("Registrations fetched successfully", list));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponseDTO>>> getRegistrationsByEvent(
            @PathVariable Long eventId) {
        List<RegistrationResponseDTO> list = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event registrations retrieved", list));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled successfully", null));
    }
}
