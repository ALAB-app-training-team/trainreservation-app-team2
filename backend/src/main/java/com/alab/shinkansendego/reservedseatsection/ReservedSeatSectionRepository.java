package com.alab.shinkansendego.reservedseatsection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservedSeatSectionRepository extends JpaRepository<ReservedSeatSectionEntity, UUID> {
    List<ReservedSeatSectionEntity> findByRideDateAndScheduleCdAndTrainCarCdAndReservedSectionCdOrderBySeatCd
        (LocalDate rideDate,
         String scheduleCd,
         String trainCarCd,
         String sectionCd);

    List<ReservedSeatSectionEntity> findByRideDateAndScheduleCdAndTrainCarCdInAndReservedSectionCdIn(
        LocalDate rideDate,
        String scheduleCd,
        List<String> trainCarCds,
        List<String> reservedSectionCds
    );

    List<ReservedSeatSectionEntity> findByReservationId(UUID reservationId);

    List<ReservedSeatSectionEntity> findByRideDateAndScheduleCdAndReservedSectionCdIn(
        LocalDate rideDate,
        String scheduleCd,
        List<String> sectionCds
    );
}
