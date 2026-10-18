package com.dbit.eventsystem.repository;

import com.dbit.eventsystem.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByParticipant_ParticipantIdAndEvent_EventId(Long participantId, Long eventId);

    long countByEvent_EventId(Long eventId);

    List<Registration> findByEvent_EventId(Long eventId);

    List<Registration> findByParticipant_ParticipantId(Long participantId);
}
