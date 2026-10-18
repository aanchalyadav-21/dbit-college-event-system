package com.dbit.eventsystem.service;

import com.dbit.eventsystem.entity.Participant;
import com.dbit.eventsystem.exception.DuplicateResourceException;
import com.dbit.eventsystem.exception.ResourceNotFoundException;
import com.dbit.eventsystem.repository.ParticipantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    @Transactional(readOnly = true)
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Participant getParticipantById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with ID: " + id));
    }

    public Participant createParticipant(Participant participant) {
        if (participantRepository.existsByEmail(participant.getEmail())) {
            throw new DuplicateResourceException("Participant with email " + participant.getEmail() + " is already registered.");
        }
        return participantRepository.save(participant);
    }

    public Participant findOrCreateParticipant(String firstName, String lastName, LocalDate dob, String email) {
        return participantRepository.findByEmail(email)
                .map(existing -> {
                    // Update basic details if changed
                    existing.setFirstName(firstName);
                    existing.setLastName(lastName);
                    existing.setDob(dob);
                    return participantRepository.save(existing);
                })
                .orElseGet(() -> {
                    Participant newParticipant = new Participant();
                    newParticipant.setFirstName(firstName);
                    newParticipant.setLastName(lastName);
                    newParticipant.setDob(dob);
                    newParticipant.setEmail(email);
                    return participantRepository.save(newParticipant);
                });
    }
}
