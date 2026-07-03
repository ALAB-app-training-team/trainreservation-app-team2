package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.purchasedseat.PurchasedSeatEntity;
import com.alab.shinkansendego.reservation.ReservationDto;
import com.alab.shinkansendego.reservation.ReservedScheduleDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<PurchaseEntity, UUID> {
    @Query("SELECT ReservedScheduleSDto(d.departureTime,ss.stationCd,ss.name,d.arrivalTime,gs.stationCd,gs.name) "+
                    "FROM PurchaseEntity p "+
                    "JOIN p.departureArrivalTime d "+
                    "JOIN d.sectionKm s "+
                    "JOIN s.startStation ss "+
                    "JOIN s.goalStation gs "+
                    "WHERE p.id=:purchaseId "+
                    "ORDER BY d.departureTime ")
    List<ReservedScheduleDto> findReservationScheduleDtoByPurchaseId(UUID purchaseId);

    @Query("SELECT ReservationDto(tt.name,p.departureStationCd,p.arrivalStationCd,p.rideDate) "+
           "FROM PurchaseEntity p "+
           "JOIN p.schedule s "+
           "JOIN s.trainType tt "+
           "WHERE p.id=:purchaseId")
    ReservationDto findReservationDtoByPurchaseId(UUID purchaseId);
}
