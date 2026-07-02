package com.alab.shinkansendego.purchasedseat;

import com.alab.shinkansendego.reservation.ReservedSeatDto;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PurchasedSeatRepository extends JpaRepository<PurchasedSeatEntity, UUID> {

    @Query("""
            SELECT new com.alab.shinkansendego.reservation.ReservedSeatDto(
                    tt.name,
                    p.departureStationCd,
                    p.arrivalStationCd,
                    p.rideDate
                    )
                    FROM PurchaseEntity p
                    JOIN p.schedule s
                    JOIN s.trainType tt
                    WHERE p.id=:purchaseId
            """)
    List<ReservedSeatDto> findReservedSeatByPurchaseId(@Param("purchase_id") UUID purchase_id);

    int insertPurchasedSeats(List<PurchasedSeatEntity> purchasedSeats);
}
