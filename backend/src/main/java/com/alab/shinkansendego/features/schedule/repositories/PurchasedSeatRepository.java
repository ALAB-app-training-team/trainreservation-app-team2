package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.entities.PurchasedSeatEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PurchasedSeatRepository {
    int insertPurchasedSeats(List<PurchasedSeatEntity> purchasedSeats);

}
