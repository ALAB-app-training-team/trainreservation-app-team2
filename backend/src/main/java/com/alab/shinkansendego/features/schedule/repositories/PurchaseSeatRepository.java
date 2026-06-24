package com.alab.shinkansendego.features.schedule.repositories;

import com.alab.shinkansendego.features.schedule.entities.PurchaseSeatEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PurchaseSeatRepository {
    int insertPurchaseSeats(List<PurchaseSeatEntity> purchaseSeats);

}
