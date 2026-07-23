package com.alab.shinkansendego.reservedseatsection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservedSeatSectionRepository extends JpaRepository<ReservedSeatSectionEntity, UUID> {
    List<ReservedSeatSectionEntity> findByRideDateAndScheduleCdAndTrainCarCdAndReservedSeatSectionCdOrderBySeatCd
        (LocalDate rideDate,
         String scheduleCd,
         String trainCarCd,
         String sectionCd);

    List<ReservedSeatSectionEntity> findByReservationId(UUID reservationId);
}
