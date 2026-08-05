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
        "schedule",
        "schedule.trainType",
        "reservedSeat",
        "reservedSeat.trainCar",
        "reservedSeat.trainCar.seatType",
        "reservedSeat.trainCar.seatType.trainCarType",
        "reservedSeat.seat"
    })
    Optional<ReservationEntity> findWithEntityGraphByIdAndAccountId(UUID reservationId, UUID accountId);

    Optional<ReservationEntity> findById(UUID id);

    List<ReservationEntity> findByAccountId(UUID accountId);

    Optional<ReservationEntity> findByIdAndAccountId(UUID reservationId, UUID accountId);
}
