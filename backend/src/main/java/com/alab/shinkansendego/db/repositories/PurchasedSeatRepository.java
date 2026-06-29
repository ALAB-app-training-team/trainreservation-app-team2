package com.alab.shinkansendego.db.repositories;

import com.alab.shinkansendego.features.reservation.dtos.ReservedSeatDto;
import com.alab.shinkansendego.features.schedule.entities.PurchasedSeatEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchasedSeatRepository {
    List<ReservedSeatDto> findReservedSeatByPurchaseId(@Param("purchase_id") UUID purchase_id);

    int insertPurchasedSeats(List<PurchasedSeatEntity> purchasedSeats);
}
