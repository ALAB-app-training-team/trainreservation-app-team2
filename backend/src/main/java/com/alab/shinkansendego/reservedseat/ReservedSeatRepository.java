package com.alab.shinkansendego.reservedseat;

import com.alab.shinkansendego.reservation.ReservedSeatDto;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservedSeatRepository extends JpaRepository<ReservedSeatEntity, UUID> {
    @Query("SELECT new com.alab.shinkansendego.reservation.ReservedSeatDto(tct.name, tc.trainCarNumber, s.seatNumber, s.seatColumn, ps.codeToken) " +
        "FROM ReservedSeatEntity ps " +
        "INNER JOIN TrainCarEntity tc ON ps.trainCarCd = tc.trainCarCd AND ps.reservationId = :reservationId " +
        "INNER JOIN SeatEntity s ON ps.seatCd = s.seatCd " +
        "INNER JOIN SeatTypeEntity st ON s.seatTypeCd = st.seatTypeCd " +
        "INNER JOIN TrainCarTypeEntity tct ON st.trainCarTypeCd = tct.trainCarTypeCd " +
        "ORDER BY tc.trainCarNumber,s.seatNumber,s.seatColumn")
    List<ReservedSeatDto> findReservedSeatDtoByReservationId(UUID reservationId);

    @EntityGraph(attributePaths = {
        "trainCar", "trainCar.seatType", "trainCar.seatType.trainCarType", "seat"})
    List<ReservedSeatEntity> findByReservationIdIn(List<UUID> reservationIds);
}
