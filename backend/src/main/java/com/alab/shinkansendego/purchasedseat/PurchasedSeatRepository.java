package com.alab.shinkansendego.purchasedseat;

import com.alab.shinkansendego.reservation.ReservedSeatDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchasedSeatRepository {
    List<ReservedSeatDto> findReservedSeatByPurchaseId(@Param("purchase_id") UUID purchase_id);

    int insertPurchasedSeats(List<PurchasedSeatEntity> purchasedSeats);
}
