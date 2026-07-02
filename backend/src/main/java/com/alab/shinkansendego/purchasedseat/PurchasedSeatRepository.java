package com.alab.shinkansendego.purchasedseat;

import com.alab.shinkansendego.reservation.ReservedSeatDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PurchasedSeatRepository extends JpaRepository<PurchasedSeatEntity, UUID> {
    @Query("SELECT new com.alab.shinkansendego.reservation.ReservedSeatDto(tct.name,tc.trainCarNumber,s.seatNumber,s.seatColumn,ps.codeToken) " +
            "FROM PurchasedSeatEntity ps " +
            "INNER JOIN TrainCarEntity tc ON ps.trainCarCd = tc.trainCarCd AND ps.purchaseId = :purchaseId " +
            "INNER JOIN SeatEntity s ON ps.seatCd = s.seatCd " +
            "INNER JOIN SeatTypeEntity st ON s.seatTypeCd = st.seatTypeCd " +
            "INNER JOIN TrainCarTypeEntity tct ON st.trainCarTypeCd = tct.trainCarTypeCd " +
            "ORDER BY tc.trainCarNumber,s.seatNumber,s.seatColumn")
    List<ReservedSeatDto> findReservedSeatDtoByPurchaseId(@Param("purchaseId")UUID purchaseId);
}
