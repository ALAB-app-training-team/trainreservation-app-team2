package com.alab.shinkansendego.purchasedseat;

import com.alab.shinkansendego.reservation.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.*;

import java.util.*;

@Repository
public interface PurchasedSeatRepository extends JpaRepository<PurchasedSeatEntity, UUID> {

    @Query("SELECT ReservedSeatDto(tct.name,tc.trainCarNumber,s.seatNumber,s.seatColumn,ps.codeToken) " +
            "FROM PurchasedSeatEntity ps " +
            "JOIN ps.trainCar tc " +
            "JOIN ps.seat s " +
            "JOIN s.seatType st " +
            "JOIN st.trainCarType tct " +
            "WHERE ps.purchaseId= :purchaseId " +
            "ORDER By tc.trainCarNumber,s.seatNumber,s.seatColumn")
    List<ReservedSeatDto> findReservedSeatDtoByPurchaseId(@Param("purchaseId") UUID purchaseId);
}
