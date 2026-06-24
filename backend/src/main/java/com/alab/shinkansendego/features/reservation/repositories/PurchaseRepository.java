package com.alab.shinkansendego.features.reservation.repositories;

import com.alab.shinkansendego.features.reservation.dtos.ReservationDto;
import com.alab.shinkansendego.features.reservation.dtos.ReservedScheduleDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchaseRepository {
    List<ReservedScheduleDto> findScheduleByPurchaseId(@Param("purchase_id") UUID purchase_id);

    ReservationDto findPurchaseByPurchaseId(@Param("purchase_id") UUID purchase_id);
}
