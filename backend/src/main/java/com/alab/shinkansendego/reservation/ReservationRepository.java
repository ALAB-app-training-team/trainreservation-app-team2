package com.alab.shinkansendego.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, UUID> {
    @Query("SELECT new com.alab.shinkansendego.reservation.ReservedScheduleDto(d.departureTime,ss.stationCd,ss.name,d.arrivalTime,gs.stationCd,gs.name) " +
            "FROM PurchaseEntity p " +
            "JOIN DepartureArrivalTimeEntity d ON p.scheduleCd = d.scheduleCd " +
            "JOIN SectionKmEntity s ON d.sectionCd = s.sectionCd " +
            "JOIN StationEntity ss ON s.startStationCd = ss.stationCd " +
            "JOIN StationEntity gs ON s.goalStationCd = gs.stationCd " +
            "WHERE p.id = :purchaseId " +
            "ORDER BY d.departureTime")
    List<ReservedScheduleDto> findReservationScheduleDtoByPurchaseId(UUID purchaseId);

    @Query("SELECT new com.alab.shinkansendego.reservation.ReservationDto(tt.name,p.departureStationCd,p.arrivalStationCd,p.rideDate) " +
            "FROM PurchaseEntity p " +
            "JOIN ScheduleEntity s ON p.scheduleCd = s.scheduleCd " +
            "JOIN TrainTypeEntity tt ON s.trainTypeCd = tt.trainTypeCd " +
            "WHERE p.id = :purchaseId")
    ReservationDto findReservationDtoByPurchaseId(UUID purchaseId);
}
