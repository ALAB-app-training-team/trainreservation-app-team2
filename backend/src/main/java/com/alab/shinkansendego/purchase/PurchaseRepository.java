package com.alab.shinkansendego.purchase;

import com.alab.shinkansendego.reservation.ReservationDto;
import com.alab.shinkansendego.reservation.ReservedScheduleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchaseRepository {
    List<ReservedScheduleDto> findScheduleByPurchaseId(@Param("purchase_id") UUID purchase_id);

    ReservationDto findPurchaseByPurchaseId(@Param("purchase_id") UUID purchase_id);

    int insertPurchase(PurchaseEntity purchaseEntity);
}
