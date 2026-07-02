package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.reservation.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.*;

@Repository
public interface PurchaseRepository extends JpaRepository<PurchaseEntity, UUID> {
    @Query("SELECT new com.alab.shinkansendego.reservation.ReservedScheduleDto(d.departureTime,ss.stationCd,ss.name,d.arrivalTime,gs.stationCd,gs.name) " +
            "FROM PurchaseEntity p " +
            "JOIN DepartureArrivalTimeEntity d ON p.scheduleCd = d.scheduleCd " +
            "JOIN SectionKmEntity s ON d.sectionCd = s.sectionCd " +
            "JOIN StationEntity ss ON s.startStationCd = ss.stationCd " +
            "JOIN StationEntity gs ON s.goalStationCd = gs.stationCd " +
            "WHERE p.id = :purchaseId " +
            "ORDER BY d.departureTime")
    List<ReservedScheduleDto> findReservationScheduleDtoByPurchaseId(@Param("purchaseId") UUID purchaseId);

    @Query("SELECT new com.alab.shinkansendego.reservation.ReservationDto(tt.name,p.departureStationCd,p.arrivalStationCd,p.rideDate) " +
            "FROM PurchaseEntity p " +
            "JOIN ScheduleEntity s ON p.scheduleCd = s.scheduleCd " +
            "JOIN TrainTypeEntity tt ON s.trainTypeCd = tt.trainTypeCd " +
            "WHERE p.id = :purchaseId")
    ReservationDto findReservationDtoByPurchaseId(@Param("purchaseId") UUID purchaseId);
}
