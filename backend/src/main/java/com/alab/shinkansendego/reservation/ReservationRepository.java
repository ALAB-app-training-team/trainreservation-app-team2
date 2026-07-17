package com.alab.shinkansendego.reservation;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, UUID> {
    @EntityGraph(attributePaths = {
        "departureArrivalTime",
        "departureArrivalTime.sectionKm",
        "departureArrivalTime.sectionKm.startStation",
        "departureArrivalTime.sectionKm.goalStation",
    })
    ReservationEntity findScheduleById(UUID uuid);

    @EntityGraph(attributePaths = {
        "schedule",
        "schedule.trainType"
    })
    Optional<ReservationEntity> findByIdAndReserverNameAndReserverMail(UUID reservationId, String reserverName, String reserverMail);

    @EntityGraph(attributePaths = {
        "schedule", "schedule.trainType",
        "departureArrivalTime",
        "departureArrivalTime.sectionKm",
        "departureArrivalTime.sectionKm.startStation",
        "departureArrivalTime.sectionKm.goalStation"})
    List<ReservationEntity> findByReserverNameAndReserverMail(String name, String email);
}
