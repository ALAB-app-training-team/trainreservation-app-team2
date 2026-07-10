package com.alab.shinkansendego.reservation;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, UUID> {
    @Query("SELECT new com.alab.shinkansendego.reservation.ReservedScheduleDto(d.departureTime,ss.stationCd,ss.name,d.arrivalTime,gs.stationCd,gs.name) " +
            "FROM ReservationEntity r " +
            "JOIN DepartureArrivalTimeEntity d ON r.scheduleCd = d.scheduleCd " +
            "JOIN SectionKmEntity s ON d.sectionCd = s.sectionCd " +
            "JOIN StationEntity ss ON s.startStationCd = ss.stationCd " +
            "JOIN StationEntity gs ON s.goalStationCd = gs.stationCd " +
            "WHERE r.id = :reservationId " +
            "ORDER BY d.departureTime")
    List<ReservedScheduleDto> findReservationScheduleDtoByReservationId(UUID reservationId);

    @Query("SELECT new com.alab.shinkansendego.reservation.ReservationDto(tt.name,r.departureStationCd,r.arrivalStationCd,r.rideDate) " +
            "FROM ReservationEntity r " +
            "JOIN ScheduleEntity s ON r.scheduleCd = s.scheduleCd " +
            "JOIN TrainTypeEntity tt ON s.trainTypeCd = tt.trainTypeCd " +
            "WHERE r.id = :reservationId")
    ReservationDto findReservationDtoByReservationId(UUID reservationId);

    @EntityGraph(attributePaths = {
            "schedule", "schedule.trainType",
            "departureArrivalTime",
            "departureArrivalTime.sectionKm",
            "departureArrivalTime.sectionKm.startStation",
            "departureArrivalTime.sectionKm.goalSection"})
    List<ReservationEntity> findByReserverNameAndReserverMail(String name, String email);
}
